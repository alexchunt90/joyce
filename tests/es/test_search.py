"""es_func.search_index against a real cluster.

This query is the most intricate thing in the backend and the least testable with a
fake: a `nested` query over search_text, with `inner_hits` to find which block
matched and `highlight` to mark the matching words, and then a parsing pass that
indexes straight into that response shape. A fake client returning a hand-built
dictionary proves nothing about any of it.

Every search result the reader clicks is a (document id, block key) pair produced
here, so the key each hit carries matters as much as the text.
"""

import pytest

from blueprints import es_func

pytestmark = pytest.mark.integration


@pytest.fixture
def library(indices, index_document, chapter_document):
    """A small corpus across three document types."""
    index_document(indices, 'chapters', 'chapter-one', chapter_document(
        'Telemachus', 1, [
            ('blk-tel-001', 'Stately, plump Buck Mulligan came from the stairhead.'),
            ('blk-tel-002', 'He held the bowl aloft and intoned.'),
            ('blk-tel-003', 'Introibo ad altare Dei.'),
        ]))
    index_document(indices, 'chapters', 'chapter-two', chapter_document(
        'Nestor', 2, [
            ('blk-nes-001', 'You, Cochrane, what city sent for him?'),
            ('blk-nes-002', 'Buck Mulligan is mentioned here too.'),
        ]))
    index_document(indices, 'notes', 'note-one', {
        'title': 'Buck Mulligan',
        'html_source': '<p data-search-key="blk-not-001">Oliver St John Gogarty.</p>',
        'search_text': [{'key': 'blk-not-001', 'text': 'Oliver St John Gogarty.'}],
        'created_at': 1700000000,
    })
    index_document(indices, 'info', 'info-one', {
        'title': 'Methods',
        'number': 1,
        'html_source': '<p data-search-key="blk-inf-001">How the notes are written.</p>',
        'search_text': [{'key': 'blk-inf-001', 'text': 'How the notes are written.'}],
        'created_at': 1700000000,
    })
    return indices


class TestSearchResults:
    def test_a_phrase_finds_the_documents_containing_it(self, library):
        results = es_func.search_index('Buck Mulligan', 'chapters', 5)
        assert {doc['id'] for doc in results} == {'chapter-one', 'chapter-two'}

    def test_a_result_carries_the_document_title_and_number(self, library):
        [result] = [d for d in es_func.search_index('stairhead', 'chapters', 5)]
        assert result['title'] == 'Telemachus'
        assert result['number'] == 1

    def test_a_hit_carries_the_key_of_the_block_that_matched(self, library):
        # This is what makes a search result clickable: the reader is sent to
        # /<number>#<key>, so the key must be the one on the matching block.
        [result] = es_func.search_index('Introibo', 'chapters', 5)
        assert [hit['key'] for hit in result['hits']] == ['blk-tel-003']

    def test_the_matching_words_are_highlighted(self, library):
        # <em>, not <b>. search_index parses the highlight out of inner_hits, and that
        # inner highlight specifies no pre/post tags, so Elasticsearch uses its
        # default. The frontend renders the snippet with dangerouslySetInnerHTML, so
        # the markup reaches the reader either way — it renders italic rather than
        # bold. See the dead outer block below.
        [result] = es_func.search_index('stairhead', 'chapters', 5)
        assert '<em>stairhead</em>' in result['hits'][0]['text']

    def test_the_outer_highlight_block_has_no_effect(self, library):
        # search_index also sends a top-level `highlight` block asking for <b> tags.
        # Nothing reads it: the parsing indexes into inner_hits, not into the
        # top-level highlight. Its tags are malformed too — post_tags is ['</b>', 'em']
        # rather than a closing tag. Pinned so removing or wiring it up is deliberate.
        # See plans/hygiene.md.
        [result] = es_func.search_index('stairhead', 'chapters', 5)
        assert '<b>' not in result['hits'][0]['text']

    def test_only_the_matching_block_is_returned_not_the_whole_document(self, library):
        # inner_hits narrows to the nested entries that matched. Without it every
        # block of a matching document would come back.
        [result] = es_func.search_index('Introibo', 'chapters', 5)
        assert len(result['hits']) == 1

    def test_a_phrase_that_appears_nowhere_returns_nothing(self, library):
        assert es_func.search_index('Finnegans Wake', 'chapters', 5) == []

    def test_matching_is_by_phrase_not_by_loose_words(self, library):
        # The query uses match_phrase, so word order and adjacency matter.
        assert es_func.search_index('Mulligan Buck', 'chapters', 5) == []

    def test_result_count_limits_the_hits_within_a_document(self, library, index_document, chapter_document):
        many = chapter_document('Proteus', 3, [
            (f'blk-pro-{n:03}', 'Ineluctable modality of the visible.') for n in range(5)
        ])
        index_document(library, 'chapters', 'chapter-three', many)
        [result] = [d for d in es_func.search_index('Ineluctable', 'chapters', 2)]
        assert len(result['hits']) == 2


class TestSortOrder:
    def test_chapters_come_back_in_chapter_order(self, library):
        results = es_func.search_index('Buck Mulligan', 'chapters', 5)
        assert [doc['number'] for doc in results] == [1, 2]

    def test_other_doc_types_sort_by_title(self, library, index_document):
        index_document(library, 'notes', 'note-two', {
            'title': 'Aaron',
            'html_source': '<p data-search-key="blk-not-002">A shared phrase.</p>',
            'search_text': [{'key': 'blk-not-002', 'text': 'A shared phrase.'}],
            'created_at': 1700000000,
        })
        index_document(library, 'notes', 'note-three', {
            'title': 'Zurich',
            'html_source': '<p data-search-key="blk-not-003">A shared phrase.</p>',
            'search_text': [{'key': 'blk-not-003', 'text': 'A shared phrase.'}],
            'created_at': 1700000000,
        })
        results = es_func.search_index('A shared phrase', 'notes', 5)
        assert [doc['title'] for doc in results] == ['Aaron', 'Zurich']

    def test_non_chapter_results_carry_no_number(self, library):
        [result] = es_func.search_index('Gogarty', 'notes', 5)
        assert result['number'] is None


class TestSearchAcrossDocTypes:
    def test_results_are_grouped_by_doc_type(self, library):
        results = es_func.es_search_text('Buck Mulligan', ['chapters', 'notes'], 5)
        assert set(results) == {'chapters', 'notes'}
        assert len(results['chapters']) == 2

    def test_a_doc_type_with_no_matches_is_present_but_empty(self, library):
        results = es_func.es_search_text('stairhead', ['chapters', 'info'], 5)
        assert results['info'] == []

    def test_each_doc_type_is_searched_independently(self, library):
        results = es_func.es_search_text('notes are written', ['chapters', 'info'], 5)
        assert results['chapters'] == []
        assert [doc['title'] for doc in results['info']] == ['Methods']


class TestPhrasesSpanningAPageBreak:
    """End-to-end check on the page break separator fix.

    convertToSearchText used to strip a page break marker to an empty string, joining
    the words either side: "the break" + "and text" was indexed as "breakand". Because
    this query uses match_phrase, that made any phrase crossing a page break
    unfindable. It now strips to a space.

    Both forms are indexed here so the difference is visible against the real query
    engine rather than argued about.
    """

    @pytest.fixture
    def both_forms(self, indices, index_document, chapter_document):
        index_document(indices, 'chapters', 'fixed', chapter_document(
            'After the fix', 1, [('blk-fix-001', 'Text before the break and text after it.')]))
        index_document(indices, 'chapters', 'legacy', chapter_document(
            'Before the fix', 2, [('blk-leg-001', 'Text before the breakand text after it.')]))
        return indices

    def test_a_phrase_crossing_a_break_is_found_in_the_fixed_form(self, both_forms):
        results = es_func.search_index('the break and text', 'chapters', 5)
        assert [doc['id'] for doc in results] == ['fixed']

    def test_the_legacy_form_is_still_unfindable(self, both_forms):
        # Documents indexed before the fix keep the concatenated text until they are
        # re-saved or reindexed. This is the reindex pass the fix needs.
        results = es_func.search_index('the break and text', 'chapters', 5)
        assert 'legacy' not in [doc['id'] for doc in results]

    def test_the_run_together_word_is_what_the_legacy_form_indexed(self, both_forms):
        results = es_func.search_index('breakand', 'chapters', 5)
        assert [doc['id'] for doc in results] == ['legacy']


class TestDocumentListAgainstRealElasticsearch:
    def test_chapters_come_back_in_number_order(self, library):
        assert [d['number'] for d in es_func.es_document_list('chapters')] == [1, 2]

    def test_the_heavy_fields_are_excluded(self, library):
        # Document lists populate sidebars; pulling html_source and search_text for
        # every document would make them enormous.
        for document in es_func.es_document_list('chapters'):
            assert 'html_source' not in document
            assert 'search_text' not in document

    def test_each_document_carries_its_elasticsearch_id(self, library):
        assert {d['id'] for d in es_func.es_document_list('chapters')} == {
            'chapter-one', 'chapter-two',
        }

    def test_notes_come_back_in_title_order(self, indices, index_document):
        for doc_id, title in [('n1', 'Zurich'), ('n2', 'Aaron'), ('n3', 'Mulligan')]:
            index_document(indices, 'notes', doc_id, {'title': title, 'created_at': 1700000000})
        assert [d['title'] for d in es_func.es_document_list('notes')] == [
            'Aaron', 'Mulligan', 'Zurich',
        ]
