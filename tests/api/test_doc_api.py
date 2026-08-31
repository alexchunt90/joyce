"""Routes reach the right Elasticsearch index with the right arguments.

The routes in doc_api.py are five near-identical CRUD blocks, one per document type,
written by copy-paste. That shape makes index-name mistakes easy and invisible: a
typo'd index name only fails at runtime, against a live cluster, on the one route
nobody exercised. `delete_edition` carried exactly that bug — it returned
`es_document_list('edtions')` — until it was fixed in d0487e7.

The fake Elasticsearch client records every call, so these tests assert the
route-to-index contract directly.
"""

import json

import pytest

DOC_TYPES = ['chapters', 'notes', 'info', 'tags', 'editions']
DOC_ID = 'AWNM3N3mxgFi4og697un'


def seed(fake_es, ids_and_sources):
    """Give the fake client a document list to return from search()."""
    fake_es.search_hits = [
        {'_id': doc_id, '_source': source} for doc_id, source in ids_and_sources
    ]
    for doc_id, source in ids_and_sources:
        fake_es.documents[doc_id] = source


class TestReadRoutes:
    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_list_searches_its_own_index(self, client, fake_es, doc_type):
        client.get(f'/api/{doc_type}/')
        assert [call['index'] for call in fake_es.calls_to('search')] == [doc_type]

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_single_document_gets_from_its_own_index(self, client, fake_es, doc_type):
        client.get(f'/api/{doc_type}/{DOC_ID}')
        assert fake_es.calls_to('get') == [{'index': doc_type, 'id': DOC_ID}]

    def test_list_response_merges_the_id_into_each_document(self, client, fake_es):
        seed(fake_es, [('id-one', {'title': 'Telemachus', 'number': 1})])
        body = client.get('/api/chapters/').get_json()
        assert body == [{'id': 'id-one', 'title': 'Telemachus', 'number': 1}]

    def test_single_document_response_merges_the_id(self, client, fake_es):
        fake_es.documents[DOC_ID] = {'title': 'Telemachus', 'html_source': '<p>x</p>'}
        body = client.get(f'/api/chapters/{DOC_ID}').get_json()
        assert body == {'id': DOC_ID, 'title': 'Telemachus', 'html_source': '<p>x</p>'}

    def test_list_excludes_the_heavy_fields(self, client, fake_es):
        # Document lists power sidebars and dropdowns; pulling html_source and
        # search_text for every document would make them enormous.
        client.get('/api/chapters/')
        excluded = fake_es.calls_to('search')[0]['_source_excludes']
        assert 'html_source' in excluded
        assert 'search_text' in excluded


class TestSortOrder:
    # Chapters and info pages are ordered by their number; notes alphabetically.
    @pytest.mark.parametrize('doc_type', ['chapters', 'info'])
    def test_numbered_types_sort_by_number(self, client, fake_es, doc_type):
        client.get(f'/api/{doc_type}/')
        assert fake_es.calls_to('search')[0]['body']['sort'] == [{'number': {'order': 'asc'}}]

    def test_notes_sort_by_title(self, client, fake_es):
        client.get('/api/notes/')
        assert fake_es.calls_to('search')[0]['body']['sort'] == [{'title': {'order': 'asc'}}]

    @pytest.mark.parametrize('doc_type', ['tags', 'editions'])
    def test_other_types_are_unsorted(self, client, fake_es, doc_type):
        client.get(f'/api/{doc_type}/')
        assert 'sort' not in fake_es.calls_to('search')[0]['body']


class TestWriteRoutes:
    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_create_indexes_into_its_own_index(self, authed_client, fake_es, doc_type):
        authed_client.put(f'/api/{doc_type}/', json={'title': 'New document'})
        indexed = fake_es.calls_to('index')
        assert len(indexed) == 1
        assert indexed[0]['index'] == doc_type

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_create_stamps_a_creation_time(self, authed_client, fake_es, doc_type):
        # joyceRouter selects the newest document after a save by sorting on
        # created_at, so a document without it would never be selected.
        authed_client.put(f'/api/{doc_type}/', json={'title': 'New document'})
        assert 'created_at' in fake_es.calls_to('index')[0]['body']

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_write_indexes_against_the_given_id(self, authed_client, fake_es, doc_type):
        authed_client.post(f'/api/{doc_type}/{DOC_ID}', json={'title': 'Edited'})
        indexed = fake_es.calls_to('index')
        assert len(indexed) == 1
        assert indexed[0]['index'] == doc_type
        assert indexed[0]['id'] == DOC_ID

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_delete_removes_from_its_own_index(self, authed_client, fake_es, doc_type):
        authed_client.delete(f'/api/{doc_type}/{DOC_ID}')
        deleted = fake_es.calls_to('delete')
        assert len(deleted) == 1
        assert deleted[0]['index'] == doc_type
        assert deleted[0]['id'] == DOC_ID

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_mutations_refresh_the_index(self, authed_client, fake_es, doc_type):
        # Every mutation responds with a freshly read document list, so the write has
        # to be visible to the search that follows it. Without refresh=True the route
        # returns the list as it was before the change.
        authed_client.delete(f'/api/{doc_type}/{DOC_ID}')
        assert fake_es.calls_to('delete')[0]['refresh'] is True

    # Regression guard for the 'edtions' typo: every mutation must respond with a
    # freshly read list from the *same* index it just wrote to. A misspelled index
    # name here raises from Elasticsearch rather than returning the list.
    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_delete_responds_with_a_list_from_the_same_index(self, authed_client, fake_es, doc_type):
        response = authed_client.delete(f'/api/{doc_type}/{DOC_ID}')
        assert response.status_code == 200
        searched = [call['index'] for call in fake_es.calls_to('search')]
        assert searched
        assert set(searched) == {doc_type}

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_create_responds_with_a_list_from_the_same_index(self, authed_client, fake_es, doc_type):
        response = authed_client.put(f'/api/{doc_type}/', json={'title': 'New'})
        assert response.status_code == 200
        assert set(call['index'] for call in fake_es.calls_to('search')) == {doc_type}


class TestChapterRenumbering:
    """Deleting a chapter renumbers the rest so numbering stays contiguous."""

    def test_deleting_a_chapter_renumbers_the_remainder(self, authed_client, fake_es):
        # Numbers 1, 3, 4 — as they would be immediately after chapter 2 was removed.
        seed(fake_es, [
            ('id-one', {'title': 'Telemachus', 'number': 1}),
            ('id-three', {'title': 'Proteus', 'number': 3}),
            ('id-four', {'title': 'Calypso', 'number': 4}),
        ])
        authed_client.delete('/api/chapters/id-two')

        updates = {call['id']: call['body']['doc']['number'] for call in fake_es.calls_to('update')}
        assert updates == {'id-three': 2, 'id-four': 3}

    def test_already_contiguous_chapters_are_not_rewritten(self, authed_client, fake_es):
        seed(fake_es, [
            ('id-one', {'title': 'Telemachus', 'number': 1}),
            ('id-two', {'title': 'Nestor', 'number': 2}),
        ])
        authed_client.delete('/api/chapters/id-three')
        assert fake_es.calls_to('update') == []

    def test_deleting_other_doc_types_does_not_renumber(self, authed_client, fake_es):
        seed(fake_es, [('id-one', {'title': 'A note', 'number': 5})])
        authed_client.delete(f'/api/notes/{DOC_ID}')
        assert fake_es.calls_to('update') == []


class TestChapterNoteTally:
    """/api/chapters/tally/ counts the distinct annotation targets per chapter."""

    def test_counts_unique_note_links_per_chapter(self, client, fake_es):
        seed(fake_es, [
            ('id-one', {'title': 'Telemachus', 'number': 1}),
            ('id-two', {'title': 'Nestor', 'number': 2}),
        ])
        fake_es.documents['id-one'] = {
            'title': 'Telemachus',
            'html_source': '<p><a href="note-a">x</a> <a href="note-b">y</a></p>',
        }
        fake_es.documents['id-two'] = {
            'title': 'Nestor',
            'html_source': '<p><a href="note-c">z</a></p>',
        }
        body = client.get('/api/chapters/tally/').get_json()
        assert body == [
            {'title': 'Telemachus', 'count': 2},
            {'title': 'Nestor', 'count': 1},
        ]

    def test_repeated_links_to_one_note_count_once(self, client, fake_es):
        seed(fake_es, [('id-one', {'title': 'Telemachus', 'number': 1})])
        fake_es.documents['id-one'] = {
            'title': 'Telemachus',
            'html_source': '<p><a href="note-a">x</a> <a href="note-a">again</a></p>',
        }
        assert client.get('/api/chapters/tally/').get_json() == [
            {'title': 'Telemachus', 'count': 1},
        ]

    def test_anchors_without_an_href_are_ignored(self, client, fake_es):
        seed(fake_es, [('id-one', {'title': 'Telemachus', 'number': 1})])
        fake_es.documents['id-one'] = {
            'title': 'Telemachus',
            'html_source': '<p><a name="anchor">x</a><a href="note-a">y</a></p>',
        }
        assert client.get('/api/chapters/tally/').get_json() == [
            {'title': 'Telemachus', 'count': 1},
        ]
