"""Shared pytest fixtures for the Flask API tests.

Environment variables are set at the very top, before any project module is
imported, because config.py reads them at import time and application.py builds the
Flask app at import time too. Nothing here needs a real .env, a real Elasticsearch,
or real Google credentials.
"""

import os

# Assigned, never setdefault. These are fixture data, not defaults: tests assert on
# the exact admin allowlist, so inheriting whatever the environment happens to hold
# makes the suite pass or fail based on where it runs. It did — the CI job set
# ADMIN_EMAIL_ADDRESSES to a different value, setdefault deferred to it, and nine
# google_auth tests failed in CI while passing locally.
#
# Set before any project import: config.py reads the environment at import time, and
# application.py builds the Flask app at import time.
os.environ['HOST_ENVIRONMENT'] = 'local'
os.environ['ADMIN_EMAIL_ADDRESSES'] = 'editor@example.com, second@example.com'
os.environ['JWT_SECRET_KEY'] = 'test-jwt-secret-not-used-in-production'
os.environ['GOOGLE_AUTH_CLIENT_ID'] = 'test-google-client-id'
os.environ['ELASTIC_USER_PASSWORD'] = 'test-elastic-password'

from types import FunctionType  # noqa: E402

import pytest  # noqa: E402
from elasticsearch import Elasticsearch  # noqa: E402
from flask_jwt_extended import create_access_token  # noqa: E402

import application as application_module  # noqa: E402
from blueprints import es_cache, es_func  # noqa: E402

EDITOR_EMAIL = 'editor@example.com'

# Every document type served by doc_api, and the index each one maps to.
DOC_TYPES = ['chapters', 'notes', 'info', 'tags', 'editions']


@pytest.fixture
def app():
    """The real application object, switched into testing mode.

    CSRF double-submit protection is disabled so that authenticated tests can send a
    JWT cookie without also threading an X-CSRF-TOKEN header through every request;
    the cookie/CSRF pairing is the frontend's concern, not the route's. The cookie
    domain is cleared because config sets it to '.localhost', which the Werkzeug test
    client will not match.
    """
    app = application_module.application
    previous = dict(app.config)
    app.config.update(
        TESTING=True,
        JWT_COOKIE_CSRF_PROTECT=False,
        JWT_COOKIE_SECURE=False,
        JWT_COOKIE_DOMAIN=None,
    )
    yield app
    app.config.clear()
    app.config.update(previous)


@pytest.fixture
def client(app):
    """An unauthenticated client — a public reader."""
    return app.test_client()


@pytest.fixture
def authed_client(app):
    """A client carrying a valid editor JWT.

    Mints the token directly rather than going through Google. google_auth.py is what
    decides *who* may hold a token; these tests are about what a token holder may do.
    """
    test_client = app.test_client()
    with app.test_request_context():
        token = create_access_token(identity=EDITOR_EMAIL)
    test_client.set_cookie('access_token_cookie', token, domain='localhost')
    return test_client


class FakeElasticsearch:
    """Records calls instead of talking to Elasticsearch.

    Only the methods es_func actually uses are implemented. Return values are shaped
    like real ES responses so merge_results and friends can process them.
    """

    def __init__(self):
        self.calls = []
        self.documents = {}
        self.search_hits = []

    def _record(self, method, **kwargs):
        self.calls.append((method, kwargs))

    def calls_to(self, method):
        return [kwargs for name, kwargs in self.calls if name == method]

    def indices_touched(self):
        return [kwargs.get('index') for _, kwargs in self.calls]

    def search(self, index=None, body=None, **kwargs):
        self._record('search', index=index, body=body, **kwargs)
        return {'hits': {'hits': self.search_hits}}

    def get(self, index=None, id=None, **kwargs):
        self._record('get', index=index, id=id, **kwargs)
        source = self.documents.get(id, {'title': 'A Document'})
        return {'_id': id, '_source': source}

    def mget(self, index=None, body=None, **kwargs):
        self._record('mget', index=index, body=body, **kwargs)
        return {'docs': [
            {'_id': doc_id, '_source': self.documents.get(doc_id, {'title': 'A Document'})}
            for doc_id in (body or {}).get('ids', [])
        ]}

    def index(self, index=None, id=None, body=None, **kwargs):
        self._record('index', index=index, id=id, body=body, **kwargs)
        return {'_id': id or 'generated-id-000001', 'result': 'created'}

    def update(self, index=None, id=None, body=None, **kwargs):
        self._record('update', index=index, id=id, body=body, **kwargs)
        return {'_id': id, 'result': 'updated'}

    def delete(self, index=None, id=None, **kwargs):
        self._record('delete', index=index, id=id, **kwargs)
        return {'_id': id, 'result': 'deleted'}


@pytest.fixture(autouse=True)
def fake_es(monkeypatch):
    """Replaces the Elasticsearch client es_func talks to.

    Autouse, so no test can reach a real Elasticsearch by forgetting to ask for it —
    without this the routes fall through to http://elasticsearch:9200 and fail on DNS.

    Several es_func functions take `es_client=es` as a default argument, and that
    default is bound at import time, so patching the module attribute alone would not
    reach them. Their defaults are rebound here too.

    The type check is deliberately `type(obj) is FunctionType` rather than
    inspect.isfunction: es_func imports Flask's `request` and `current_app` proxies,
    and isinstance-style checks on those resolve the proxy and raise outside an
    application context.
    """
    fake = FakeElasticsearch()
    monkeypatch.setattr(es_func, 'es', fake)

    for _name, obj in list(vars(es_func).items()):
        if type(obj) is FunctionType and obj.__defaults__:
            rebound = tuple(
                fake if isinstance(default, Elasticsearch) else default
                for default in obj.__defaults__
            )
            if rebound != obj.__defaults__:
                monkeypatch.setattr(obj, '__defaults__', rebound)

    return fake


@pytest.fixture(autouse=True)
def clear_document_list_cache():
    """Empties the document-list cache around every test.

    es_document_list is served from a 60s TTL cache keyed only on the index name, so
    without this one test's cached list is handed to the next — and most of these tests
    assert on how many times Elasticsearch was searched, which would then be zero.
    Clearing afterwards too keeps a fake client's documents from outliving its test.
    """
    es_cache.clear()
    yield
    es_cache.clear()
