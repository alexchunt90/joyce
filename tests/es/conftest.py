"""Fixtures for tests that run against a real Elasticsearch.

Everything else in tests/ uses a fake client, which is right for route and
data-layer behaviour but cannot validate the things Elasticsearch itself decides:
whether the index mappings are what es_config declares, whether html_analyzer
strips tags the way it is meant to, and whether the nested query in
es_func.search_index actually returns the inner_hits and highlight structure the
parsing code indexes into.

These tests need a cluster. They are marked `integration` and excluded from the
default run — see pytest.ini — and skip themselves if nothing is listening, so a
developer without Elasticsearch up never sees a failure they cannot act on.

Start one that is isolated from the project's own data volume:

    docker run -d --name joyce-test-es -p 9201:9200 \\
      -e discovery.type=single-node -e xpack.security.enabled=false \\
      -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \\
      docker.elastic.co/elasticsearch/elasticsearch:8.17.0
"""

import os
from types import FunctionType

import pytest
from elasticsearch import Elasticsearch

from blueprints import es_func
from setup import es_config

# Deliberately not the compose service's port. These tests delete and recreate every
# index they touch, so they must never be able to reach real data.
TEST_ES_HOST = os.getenv('TEST_ELASTICSEARCH_HOST', 'http://localhost:9201')

INDEX_SETTINGS = {
    'chapters': es_config.CHAPTER_INDEX_SETTINGS,
    'notes': es_config.NOTE_INDEX_SETTINGS,
    'info': es_config.INFO_INDEX_SETTINGS,
    'tags': es_config.TAG_INDEX_SETTINGS,
    'editions': es_config.EDITION_INDEX_SETTINGS,
    'media': es_config.MEDIA_INDEX_SETTINGS,
}


@pytest.fixture(scope='session')
def es_client():
    client = Elasticsearch([TEST_ES_HOST], request_timeout=10)
    try:
        if not client.ping():
            pytest.skip(f'No Elasticsearch at {TEST_ES_HOST}', allow_module_level=True)
    except Exception as error:
        pytest.skip(f'No Elasticsearch at {TEST_ES_HOST}: {error}', allow_module_level=True)
    return client


@pytest.fixture(autouse=True)
def fake_es(es_client, monkeypatch):
    """Shadows the autouse fake client from tests/conftest.py.

    Same name on purpose: pytest resolves fixtures from the nearest conftest, so
    naming it identically replaces the fake for everything under tests/es/ without
    each test having to opt out. The es_client defaults bound at import time are
    rebound here for the same reason they are in the parent.
    """
    monkeypatch.setattr(es_func, 'es', es_client)
    for _name, obj in list(vars(es_func).items()):
        if type(obj) is FunctionType and obj.__defaults__:
            rebound = tuple(
                es_client if isinstance(default, Elasticsearch) else default
                for default in obj.__defaults__
            )
            if rebound != obj.__defaults__:
                monkeypatch.setattr(obj, '__defaults__', rebound)
    return es_client


@pytest.fixture
def indices(es_client):
    """Create every index from the real es_config mappings, and drop them after.

    Uses the same settings the production setup script does, so a mapping change
    that breaks a query is caught here rather than on a deploy.
    """
    for index, settings in INDEX_SETTINGS.items():
        es_client.indices.delete(index=index, ignore_unavailable=True)
        es_client.indices.create(index=index, **settings)
    yield es_client
    for index in INDEX_SETTINGS:
        es_client.indices.delete(index=index, ignore_unavailable=True)


# Exposed as fixtures rather than module-level functions: tests/es/ has no
# __init__.py, so a test module cannot import from this conftest directly.
@pytest.fixture
def index_document():
    def _index(es_client, index, doc_id, source):
        es_client.index(index=index, id=doc_id, document=source, refresh=True)
    return _index


@pytest.fixture
def chapter_document():
    """A chapter as the app stores one.

    Annotated HTML plus a search_text array whose keys match the data-search-key
    values in that HTML — the invariant convertToSearchText guarantees, and the one
    that makes a search hit resolve to a real block.
    """
    def _chapter(title, number, blocks):
        html = ''.join(
            f'<p data-search-key="{key}" data-align="left">{text}</p>' for key, text in blocks
        )
        return {
            'title': title,
            'number': number,
            'html_source': html,
            'search_text': [{'key': key, 'text': text} for key, text in blocks],
            'created_at': 1700000000,
        }
    return _chapter
