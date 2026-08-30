"""The public/private boundary.

Joyce serves two audiences from one codebase: anonymous readers, who may read
everything, and authenticated editors, who may write. That split is the app's one
genuine security property, and it is enforced by a single `@jwt_required()` decorator
per route — easy to forget when adding a route, and invisible when it is missing.

These tests walk every write route and assert it refuses an anonymous caller.
"""

import pytest

# Every document type served by blueprints/doc_api.py. Media is separate because
# media_api.py has a different route shape (form uploads, a bulk endpoint).
DOC_TYPES = ['chapters', 'notes', 'info', 'tags', 'editions']

# A real Elasticsearch id, as it appears in reader URLs.
DOC_ID = 'AWNM3N3mxgFi4og697un'


class TestReadRoutesArePublic:
    """Readers are anonymous; nothing on the read path may require a token."""

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_document_list_is_public(self, client, doc_type):
        assert client.get(f'/api/{doc_type}/').status_code == 200

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_single_document_is_public(self, client, doc_type):
        assert client.get(f'/api/{doc_type}/{DOC_ID}').status_code == 200

    def test_media_list_is_public(self, client):
        assert client.get('/api/media/').status_code == 200

    def test_single_media_document_is_public(self, client):
        assert client.get(f'/api/media/{DOC_ID}').status_code == 200

    def test_bulk_media_lookup_is_public(self, client):
        assert client.post('/api/media/bulk/', json=[DOC_ID]).status_code == 200

    def test_chapter_tally_is_public(self, client):
        assert client.get('/api/chapters/tally/').status_code == 200

    def test_search_is_public(self, client):
        response = client.post('/api/search/', json={'data': {
            'searchInput': 'stately', 'docTypes': {'chapters': True}, 'resultCount': 5,
        }})
        assert response.status_code == 200


class TestWriteRoutesRequireAuthentication:
    """Every mutation must refuse an anonymous caller."""

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_create_is_rejected(self, client, doc_type):
        assert client.put(f'/api/{doc_type}/', json={'title': 'New'}).status_code == 401

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_write_is_rejected(self, client, doc_type):
        assert client.post(f'/api/{doc_type}/{DOC_ID}', json={'title': 'Edited'}).status_code == 401

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_delete_is_rejected(self, client, doc_type):
        assert client.delete(f'/api/{doc_type}/{DOC_ID}').status_code == 401

    def test_media_create_is_rejected(self, client):
        assert client.post('/api/media/', data={'youtube_url': 'x'}).status_code == 401

    def test_media_write_is_rejected(self, client):
        assert client.post(f'/api/media/{DOC_ID}', data={'title': 'x'}).status_code == 401

    def test_media_delete_is_rejected(self, client):
        assert client.delete(f'/api/media/{DOC_ID}').status_code == 401


class TestWriteRoutesAcceptAnEditor:
    """The same routes must accept a valid editor token.

    Without these, a route that rejected *everyone* would pass the tests above.
    """

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_create_is_accepted(self, authed_client, doc_type):
        response = authed_client.put(f'/api/{doc_type}/', json={'title': 'New'})
        assert response.status_code == 200

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_write_is_accepted(self, authed_client, doc_type):
        response = authed_client.post(f'/api/{doc_type}/{DOC_ID}', json={'title': 'Edited'})
        assert response.status_code == 200

    @pytest.mark.parametrize('doc_type', DOC_TYPES)
    def test_delete_is_accepted(self, authed_client, doc_type):
        assert authed_client.delete(f'/api/{doc_type}/{DOC_ID}').status_code == 200


class TestUnauthenticatedWriteEndpoint:
    """/api/search_text/<id> mutates documents without any authentication.

    Every other write route in doc_api.py carries @jwt_required(). This one does not,
    and es_func.es_update_search_text writes both `search_text` *and* `html_source` —
    the annotated HTML readers see. An anonymous caller can therefore replace the body
    of any chapter, note or info page given only its id, and ids are visible in reader
    URLs.

    Pinned as the current behaviour rather than asserted as correct. See
    plans/hygiene.md.
    """

    def test_it_accepts_an_anonymous_caller(self, client):
        response = client.post(f'/api/search_text/{DOC_ID}', json={
            'doc_type': 'chapters', 'search_text': [], 'html_source': '<p>replaced</p>',
        })
        assert response.status_code == 200

    def test_the_anonymous_write_reaches_elasticsearch(self, client, fake_es):
        client.post(f'/api/search_text/{DOC_ID}', json={
            'doc_type': 'chapters', 'search_text': [{'key': 'k', 'text': 't'}],
            'html_source': '<p>replaced</p>',
        })
        updates = fake_es.calls_to('update')
        assert len(updates) == 1
        assert updates[0]['index'] == 'chapters'
        assert updates[0]['body']['doc']['html_source'] == '<p>replaced</p>'
