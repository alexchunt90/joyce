"""The index mappings and the custom analyzer, against a real cluster.

setup/es_config.py declares these, but nothing verified that Elasticsearch accepts
them or behaves the way the queries assume. Two assumptions in particular are load
bearing: search_text must be a `nested` field for search_index's nested query to
return inner_hits at all, and html_analyzer must strip markup while preserving the
annotation links that make the text navigable.
"""

import pytest

pytestmark = pytest.mark.integration

DOC_TYPES = ['chapters', 'notes', 'info', 'tags', 'editions', 'media']


class TestMappingsAreAccepted:
    def test_every_index_is_created_from_the_real_settings(self, indices):
        for index in DOC_TYPES:
            assert indices.indices.exists(index=index)

    @pytest.mark.parametrize('index', DOC_TYPES)
    def test_search_text_is_a_nested_field(self, indices, index):
        # search_index queries search_text with a `nested` query. Against an object
        # field rather than a nested one, Elasticsearch rejects the query outright.
        mapping = indices.indices.get_mapping(index=index)[index]['mappings']
        assert mapping['properties']['search_text']['type'] == 'nested'

    @pytest.mark.parametrize('index', DOC_TYPES)
    def test_title_is_a_keyword_so_it_can_be_sorted_on(self, indices, index):
        # search_index sorts on `title` for every doc type except chapters. A `text`
        # field would need fielddata enabled and would otherwise fail the search.
        mapping = indices.indices.get_mapping(index=index)[index]['mappings']
        assert mapping['properties']['title']['type'] == 'keyword'

    @pytest.mark.parametrize('index', ['chapters', 'info'])
    def test_number_is_an_integer_so_it_sorts_numerically(self, indices, index):
        mapping = indices.indices.get_mapping(index=index)[index]['mappings']
        assert mapping['properties']['number']['type'] == 'integer'

    @pytest.mark.parametrize('index', DOC_TYPES)
    def test_html_source_uses_the_custom_analyzer(self, indices, index):
        mapping = indices.indices.get_mapping(index=index)[index]['mappings']
        assert mapping['properties']['html_source']['analyzer'] == 'html_analyzer'


class TestHtmlAnalyzer:
    """html_strip with `a` escaped: markup is discarded, annotation links are not."""

    def analyze(self, indices, text):
        result = indices.indices.analyze(index='chapters', analyzer='html_analyzer', text=text)
        return [token['token'] for token in result['tokens']]

    def test_block_markup_is_stripped(self, indices):
        tokens = self.analyze(indices, '<p data-align="left">Stately plump Buck</p>')
        assert tokens == ['Stately', 'plump', 'Buck']

    def test_anchor_tags_survive_as_tokens(self, indices):
        # escaped_tags: ['a'] keeps anchors out of html_strip, so the tag itself is
        # tokenised. This is what lets a search reach the annotation links embedded
        # in the prose rather than only the prose around them.
        tokens = self.analyze(indices, '<p>Buck <a href="note-1">Mulligan</a> came</p>')
        assert 'Mulligan' in tokens
        assert 'a' in tokens

    def test_the_prose_around_a_link_is_still_indexed(self, indices):
        tokens = self.analyze(indices, '<p>Buck <a href="note-1">Mulligan</a> came</p>')
        assert 'Buck' in tokens
        assert 'came' in tokens

    def test_attribute_values_of_stripped_tags_are_discarded(self, indices):
        tokens = self.analyze(indices, '<p data-search-key="abc123" data-align="left">Stately</p>')
        assert tokens == ['Stately']

    def test_page_break_spans_are_stripped(self, indices):
        # Page break markers live in a <span>, which is not escaped, so html_strip
        # removes the tag. The marker text itself is a separate concern — see
        # convertToSearchText, which strips it before search_text is built.
        tokens = self.analyze(indices, '<p>before<span data-edition="1922">x</span>after</p>')
        assert 'span' not in tokens
