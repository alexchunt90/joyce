"""The document-list cache, and the invalidation that keeps editors honest.

es_document_list is the app's most-repeated query and its least volatile: the lists
only move when an editor saves, but every page view asks for several of them. Caching
them is only safe if every write drops what it changed — an editor who saves and then
sees the list they had before would be a worse bug than the read amplification this
removes. These tests pin both halves.
"""

import threading

import pytest

from blueprints import es_cache, es_func

DOC_TYPES = ['chapters', 'notes', 'info', 'tags', 'editions']
DOC_ID = 'AWNM3N3mxgFi4og697un'


def searches(fake_es):
    return [call['index'] for call in fake_es.calls_to('search')]


class TestCaching:
    def test_a_repeated_list_is_served_without_asking_elasticsearch_again(self, fake_es):
        es_func.es_document_list('chapters')
        es_func.es_document_list('chapters')
        es_func.es_document_list('chapters')
        assert searches(fake_es) == ['chapters']

    def test_the_cached_list_has_the_same_content_as_the_first_read(self, fake_es):
        fake_es.search_hits = [{'_id': 'ch-1', '_source': {'title': 'Telemachus', 'number': 1}}]
        first = es_func.es_document_list('chapters')
        second = es_func.es_document_list('chapters')
        assert first == second == [{'id': 'ch-1', 'title': 'Telemachus', 'number': 1}]

    def test_each_document_type_is_cached_separately(self, fake_es):
        for doc_type in DOC_TYPES:
            es_func.es_document_list(doc_type)
            es_func.es_document_list(doc_type)
        assert searches(fake_es) == DOC_TYPES

    def test_an_empty_list_is_cached_rather_than_re_queried(self, fake_es):
        # A miss cannot be signalled by falsiness: an index with no documents returns
        # [], and treating that as "not cached" would query Elasticsearch every time
        # for exactly the indices that have nothing to send.
        fake_es.search_hits = []
        assert es_func.es_document_list('editions') == []
        assert es_func.es_document_list('editions') == []
        assert searches(fake_es) == ['editions']

    def test_clearing_forces_the_next_read_back_to_elasticsearch(self, fake_es):
        es_func.es_document_list('notes')
        es_cache.clear()
        es_func.es_document_list('notes')
        assert searches(fake_es) == ['notes', 'notes']

    def test_the_query_itself_is_still_reachable_uncached(self, fake_es):
        # query_document_list is what get_or_build calls. Kept public so the shape of
        # the query stays testable without going through the cache.
        es_func.query_document_list('chapters')
        es_func.query_document_list('chapters')
        assert searches(fake_es) == ['chapters', 'chapters']


class TestInvalidation:
    """Every write path in es_func drops the list it changed."""

    def test_indexing_a_document_invalidates_its_type(self, fake_es):
        es_func.es_document_list('notes')
        es_func.es_index_document('notes', DOC_ID, {'title': 'Edited'})
        es_func.es_document_list('notes')
        assert searches(fake_es) == ['notes', 'notes']

    def test_creating_a_document_invalidates_its_type(self, fake_es):
        es_func.es_document_list('notes')
        es_func.es_create_document('notes', b'{"title": "New"}')
        es_func.es_document_list('notes')
        assert searches(fake_es) == ['notes', 'notes']

    def test_updating_a_document_invalidates_its_type(self, fake_es):
        es_func.es_document_list('chapters')
        es_func.es_update_document('chapters', DOC_ID, {'number': 2})
        es_func.es_document_list('chapters')
        assert searches(fake_es) == ['chapters', 'chapters']

    def test_deleting_a_document_invalidates_its_type(self, fake_es):
        es_func.es_document_list('tags')
        es_func.es_delete_document('tags', DOC_ID)
        es_func.es_document_list('tags')
        assert searches(fake_es) == ['tags', 'tags']

    def test_a_write_leaves_other_document_types_cached(self, fake_es):
        es_func.es_document_list('chapters')
        es_func.es_document_list('notes')
        es_func.es_index_document('notes', DOC_ID, {'title': 'Edited'})
        es_func.es_document_list('chapters')
        es_func.es_document_list('notes')
        assert searches(fake_es) == ['chapters', 'notes', 'notes']

    def test_invalidation_happens_after_the_write_not_before(self, fake_es):
        # Invalidating first leaves a window where a concurrent read misses, queries
        # the pre-write state and caches it, with nothing left to clear it until the
        # TTL expires. Asserting on call order is the only way to pin this.
        es_func.es_index_document('notes', DOC_ID, {'title': 'Edited'})
        assert [name for name, _ in fake_es.calls] == ['index']
        # The cache is empty afterwards, so the write completed before the drop.
        es_func.es_document_list('notes')
        assert searches(fake_es) == ['notes']


class TestChapterDeletion:
    def test_renumbering_reads_the_list_after_the_delete_not_from_cache(self, fake_es):
        # es_delete_document calls renumber_chapters, which reads the chapter list
        # straight back. Served a cached copy, it would renumber against a list that
        # still contains the chapter just deleted and rewrite every number wrongly.
        fake_es.search_hits = [
            {'_id': 'ch-1', '_source': {'title': 'One', 'number': 1}},
            {'_id': 'ch-2', '_source': {'title': 'Two', 'number': 2}},
            {'_id': 'ch-3', '_source': {'title': 'Three', 'number': 3}},
        ]
        es_func.es_document_list('chapters')
        fake_es.search_hits = [
            {'_id': 'ch-1', '_source': {'title': 'One', 'number': 1}},
            {'_id': 'ch-3', '_source': {'title': 'Three', 'number': 3}},
        ]
        es_func.es_delete_document('chapters', 'ch-2')
        renumbered = {call['id']: call['body']['doc']['number'] for call in fake_es.calls_to('update')}
        assert renumbered == {'ch-3': 2}


class TestRoutes:
    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_a_second_reader_does_not_reach_elasticsearch(self, client, fake_es, doc_type):
        client.get(f'/api/{doc_type}/')
        client.get(f'/api/{doc_type}/')
        assert searches(fake_es) == [doc_type]

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_an_editor_sees_their_own_save(self, authed_client, client, fake_es, doc_type):
        # The whole risk of caching these. The editor saves, the frontend reloads the
        # list, and it must not be the copy from before the save.
        fake_es.search_hits = [{'_id': DOC_ID, '_source': {'title': 'Before'}}]
        assert client.get(f'/api/{doc_type}/').json[0]['title'] == 'Before'

        fake_es.search_hits = [{'_id': DOC_ID, '_source': {'title': 'Edited'}}]
        saved = authed_client.post(f'/api/{doc_type}/{DOC_ID}', json={'title': 'Edited'})

        # The write route answers with the list itself, and that is what the editor's
        # frontend renders, so it has to carry the save too.
        assert saved.json[0]['title'] == 'Edited'
        assert client.get(f'/api/{doc_type}/').json[0]['title'] == 'Edited'

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_the_list_a_write_returns_repopulates_the_cache(self, authed_client, client, fake_es, doc_type):
        # Invalidation drops the list, but the write route immediately reads it back to
        # answer with, so the next reader is served from cache rather than paying for
        # the miss the save created.
        client.get(f'/api/{doc_type}/')
        fake_es.calls.clear()
        authed_client.post(f'/api/{doc_type}/{DOC_ID}', json={'title': 'Edited'})
        client.get(f'/api/{doc_type}/')
        assert searches(fake_es) == [doc_type]

    def test_media_uploads_invalidate_the_media_list(self, client, fake_es):
        # media_api writes through es_func like everything else, so it inherits the
        # invalidation rather than needing its own.
        client.get('/api/media/')
        es_func.es_create_document('media', b'{"title": "New image"}')
        client.get('/api/media/')
        assert searches(fake_es) == ['media', 'media']


class TestConcurrency:
    def test_parallel_readers_all_receive_the_list(self, fake_es):
        # get_or_build deliberately builds outside the lock, so two simultaneous misses
        # may both query. What must hold is that every caller gets correct data and the
        # cache is not left corrupted.
        fake_es.search_hits = [{'_id': 'ch-1', '_source': {'title': 'Telemachus'}}]
        expected = [{'id': 'ch-1', 'title': 'Telemachus'}]
        results = []
        errors = []

        def read():
            try:
                results.append(es_func.es_document_list('chapters'))
            except Exception as error:  # pragma: no cover - only fires on a real bug
                errors.append(error)

        threads = [threading.Thread(target=read) for _ in range(12)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()

        assert errors == []
        assert results == [expected] * 12


class TestConfiguration:
    def test_the_ttl_is_a_minute(self):
        assert es_cache.TTL_SECONDS == 60

    def test_the_cache_holds_every_document_type_at_once(self):
        # Six indices today. An LRU that could evict one of them would silently turn
        # into a much weaker cache without failing anything.
        assert es_cache._cache.maxsize >= 6
