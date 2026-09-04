"""A small TTL cache for the document lists.

`es_document_list` is the most-requested query in the app and the least likely to have
changed between requests: the lists only move when an editor saves, which happens a
handful of times a day at most, while every page view asks for several of them. Until
the frontend started fetching the large ones lazily, every visitor pulled all six.
Production showed roughly 90:1 egress-to-ingress on the Elasticsearch container — about
1.9GB/day out of a single node on a 3.8GiB VM with no swap.

Caching them makes list traffic constant with respect to visitor volume, which is the
property that matters here. Crawlers hit every path the SPA serves, and the app has no
way to ask them not to.

Writes invalidate their own index (see es_func), so an editor never reads a stale list
after saving. The TTL is the backstop for the writes this process cannot see: the
scripts under setup/ index documents out of process, against their own client.
"""

import threading

from cachetools import TTLCache

# Long enough to collapse a burst of traffic onto one query, short enough that anything
# that slips past invalidation — an out-of-process import, a write path added later that
# forgets to call invalidate — corrects itself while someone is still looking at it.
TTL_SECONDS = 60

# One entry per document type. There are six.
_cache = TTLCache(maxsize=16, ttl=TTL_SECONDS)

# cachetools containers are not thread-safe and waitress serves on a thread pool.
_lock = threading.Lock()


def get_or_build(index, build):
    """Return the cached list for `index`, or call `build()` and cache the result.

    `build` runs outside the lock. Holding it across an Elasticsearch round trip would
    serialise every waitress thread behind whichever one missed. The cost is that two
    simultaneous misses both query — harmless, and much cheaper than the alternative.

    The returned list is the cached object itself, not a copy. Callers must not mutate
    it; today they either serialise it or iterate it.
    """
    with _lock:
        if index in _cache:
            return _cache[index]

    documents = build()

    with _lock:
        _cache[index] = documents
    return documents


def invalidate(index):
    """Drop the cached list for one document type. Called by every write in es_func."""
    with _lock:
        _cache.pop(index, None)


def clear():
    """Drop everything. For tests, and for anything that rewrites several indices."""
    with _lock:
        _cache.clear()
