"""The data-access layer's own helpers.

blueprints/es_func.py is the single place the app talks to Elasticsearch. Most of it
is thin wrapping, but the response-shaping helpers and the media filename handling are
pure functions worth pinning directly rather than only through the routes.
"""

import pytest

from blueprints import es_func


class TestResponseShaping:
    """Elasticsearch returns _id separately from _source; the API merges them."""

    def test_merge_id_and_source_folds_the_id_in(self):
        merged = es_func.merge_id_and_source('doc-1', {'title': 'Telemachus', 'number': 1})
        assert merged == {'id': 'doc-1', 'title': 'Telemachus', 'number': 1}

    def test_merge_id_and_source_does_not_mutate_the_source(self):
        source = {'title': 'Telemachus'}
        es_func.merge_id_and_source('doc-1', source)
        assert source == {'title': 'Telemachus'}

    def test_an_id_field_in_the_source_shadows_the_real_document_id(self):
        # merge_id_and_source seeds {'id': id} and then update()s the source over it,
        # so a document carrying its own 'id' field wins and the real Elasticsearch id
        # never reaches the frontend — which routes on it. No document type stores an
        # 'id' field today, so this is latent, but the precedence is backwards.
        merged = es_func.merge_id_and_source('real-id', {'id': 'stale-id'})
        assert merged['id'] == 'stale-id'

    def test_merge_results_maps_over_hits(self):
        hits = [
            {'_id': 'a', '_source': {'title': 'One'}},
            {'_id': 'b', '_source': {'title': 'Two'}},
        ]
        assert es_func.merge_results(hits) == [
            {'id': 'a', 'title': 'One'},
            {'id': 'b', 'title': 'Two'},
        ]

    def test_merge_results_skips_hits_with_no_source(self):
        # mget returns entries without _source for ids that do not exist, and a note
        # linking to a deleted media document produces exactly that.
        hits = [
            {'_id': 'a', '_source': {'title': 'One'}},
            {'_id': 'missing', 'found': False},
        ]
        assert es_func.merge_results(hits) == [{'id': 'a', 'title': 'One'}]

    def test_merge_results_of_nothing_is_an_empty_list(self):
        assert es_func.merge_results([]) == []


class TestMediaFilenames:
    @pytest.mark.parametrize('filename,expected', [
        ('tower.jpg', 'jpg'),
        ('tower.JPG', 'jpg'),
        ('a.file.with.dots.png', 'png'),
        ('recording.MP3', 'mp3'),
    ])
    def test_file_extension_is_lowercased_and_taken_from_the_end(self, filename, expected):
        assert es_func.file_extension(filename) == expected

    @pytest.mark.parametrize('filename', [
        'tower.jpg', 'tower.jpeg', 'tower.png', 'tower.gif',
        'clip.mov', 'clip.mp4', 'audio.mp3', 'audio.wav',
    ])
    def test_allowed_files_match_config(self, filename):
        assert es_func.allowed_file(filename) is True

    @pytest.mark.parametrize('filename', [
        'script.js', 'document.pdf', 'archive.zip', 'noextension',
    ])
    def test_disallowed_files_are_rejected(self, filename):
        assert es_func.allowed_file(filename) is False

    @pytest.mark.parametrize('extension,expected', [
        ('png', 'img'), ('jpg', 'img'), ('jpeg', 'img'), ('gif', 'img'),
        ('mov', 'video'), ('mp4', 'video'),
        ('mp3', 'audio'), ('wav', 'audio'),
    ])
    def test_file_type_is_derived_from_the_extension(self, extension, expected):
        assert es_func.get_file_type(extension) == expected

    def test_an_unknown_extension_has_no_type(self):
        assert es_func.get_file_type('pdf') is None

    def test_media_metadata_from_a_plain_filename(self):
        data = es_func.media_data_from_file('MartelloTower.jpg', '')
        assert data == {
            'file_name': 'MartelloTower.jpg',
            'title': 'MartelloTower',
            'thumb_file': 'MartelloTower.jpg',
            'file_ext': 'jpg',
            'type': 'img',
        }

    def test_media_metadata_from_an_import_folder_splits_images_and_thumbs(self):
        data = es_func.media_data_from_file('tower.jpg', 'legacy')
        assert data['file_name'] == 'legacy/images/tower.jpg'
        assert data['thumb_file'] == 'legacy/thumbs/tower.jpg'

    def test_the_title_is_the_filename_before_the_first_dot(self):
        # Note this splits on the *first* dot, so a dotted filename loses everything
        # after it — 'a.file.with.dots.png' becomes 'a', not 'a.file.with.dots'.
        assert es_func.media_data_from_file('a.file.with.dots.png', '')['title'] == 'a'


class TestDocumentListQuery:
    def test_requests_a_large_page_so_nothing_is_paginated_away(self, fake_es):
        # There is no pagination anywhere in the frontend; the lists are expected
        # whole. 10000 is Elasticsearch's default max_result_window.
        es_func.es_document_list('chapters')
        body = fake_es.calls_to('search')[0]['body']
        assert body['from'] == 0
        assert body['size'] == 10000
        assert body['query'] == {'match_all': {}}

    def test_uses_the_injected_client_rather_than_the_module_level_one(self, fake_es):
        # es_index_document once accepted es_client but called the module-level `es`
        # regardless, which is the shape of the bug fixed in 3362404.
        es_func.es_index_document('chapters', 'doc-1', {'title': 'x'}, es_client=fake_es)
        assert fake_es.calls_to('index')[0]['index'] == 'chapters'


class TestRenumberChapters:
    def test_assigns_contiguous_numbers_from_one(self, fake_es):
        fake_es.search_hits = [
            {'_id': 'a', '_source': {'number': 1}},
            {'_id': 'b', '_source': {'number': 5}},
            {'_id': 'c', '_source': {'number': 9}},
        ]
        es_func.renumber_chapters()
        updates = {call['id']: call['body']['doc']['number'] for call in fake_es.calls_to('update')}
        assert updates == {'b': 2, 'c': 3}

    def test_writes_nothing_when_numbering_is_already_correct(self, fake_es):
        fake_es.search_hits = [
            {'_id': 'a', '_source': {'number': 1}},
            {'_id': 'b', '_source': {'number': 2}},
        ]
        es_func.renumber_chapters()
        assert fake_es.calls_to('update') == []

    def test_returns_the_chapter_list(self, fake_es):
        fake_es.search_hits = [{'_id': 'a', '_source': {'number': 1, 'title': 'Telemachus'}}]
        assert es_func.renumber_chapters() == [{'id': 'a', 'number': 1, 'title': 'Telemachus'}]
