// search_text is what Elasticsearch indexes and what search results link back to.
// Two entries in this repo's history are about this function:
//   55e813c  Fixing search text keys being out sync with HTML
//   1f3721e  Fix page breaks showing up in search results
// Both are invariants rather than one-off fixes, so both are pinned here.

import { stateFromHTML, stateToHTML } from '../../src/modules/draftConversion'
import { convertToSearchText } from '../../src/modules/editorSettings'
import { ALL_BLOCK_TYPES, ALL_ENTITY_TYPES, PAGINATED_1922 } from '../fixtures/documents'

const searchKeysInHTML = html =>
	[...html.matchAll(/data-search-key="([^"]*)"/g)].map(m => m[1])

describe('the key invariant (guards 55e813c)', () => {
	// A search hit is rendered as a link to /<doc>#<key>, where <key> came from
	// search_text. If the HTML written in the same save carries different keys, every
	// search result points at a block that does not exist. Both come from the same
	// contentState, so they must agree exactly, in order.
	test.each([
		['all block types', ALL_BLOCK_TYPES],
		['all entity types', ALL_ENTITY_TYPES],
		['a paginated document', PAGINATED_1922],
	])('%s: search_text keys match the data-search-key values in the HTML', (_name, html) => {
		const contentState = stateFromHTML(html)
		const searchText = convertToSearchText(contentState)
		const emittedHTML = stateToHTML(contentState)

		expect(searchText.map(b => b.key)).toEqual(searchKeysInHTML(emittedHTML))
	})

	test('there is exactly one search_text entry per block', () => {
		const contentState = stateFromHTML(ALL_BLOCK_TYPES)
		expect(convertToSearchText(contentState)).toHaveLength(5)
	})

	test('keys are unique within a document', () => {
		const keys = convertToSearchText(stateFromHTML(ALL_BLOCK_TYPES)).map(b => b.key)
		expect(new Set(keys).size).toBe(keys.length)
	})
})

describe('page break markers (guards 1f3721e)', () => {
	// Page break entities carry visible marker text of the form <year>#<page>, e.g.
	// "1922#12". Left in place it is indexed and shows up inside search snippets.
	test('the marker text is stripped from the indexed text', () => {
		const [, , third] = convertToSearchText(stateFromHTML(ALL_ENTITY_TYPES))
		expect(third.text).not.toContain('1922#12')
		expect(third.text).not.toContain('#')
	})

	// Regression guard: the marker was previously replaced with an empty string, which
	// joined the words either side of a mid-sentence break — "the break" + "and text"
	// became "breakand" — making any phrase spanning a page break unfindable, since
	// search_index() queries with match_phrase. It is now replaced with a space.
	test('stripping leaves a separator between the surrounding words', () => {
		const [, , third] = convertToSearchText(stateFromHTML(ALL_ENTITY_TYPES))
		expect(third.text).toBe('Text before the break and text after it.')
	})

	test('a phrase spanning a page break survives into the indexed text', () => {
		const [, , third] = convertToSearchText(stateFromHTML(ALL_ENTITY_TYPES))
		expect(third.text).toContain('the break and text')
	})

	test('every block of a paginated document is free of markers', () => {
		for (const block of convertToSearchText(stateFromHTML(PAGINATED_1922))) {
			expect(block.text).not.toMatch(/\d{4}#\d{1,3}/)
		}
	})

	test('surrounding prose is preserved either side of a stripped marker', () => {
		const blocks = convertToSearchText(stateFromHTML(PAGINATED_1922))
		expect(blocks[2].text).toContain('Start of three')
		expect(blocks[2].text).toContain('and the remainder after the break.')
	})

	test('a three-digit page number is stripped completely', () => {
		const html = '<p data-search-key="a">before<span data-edition="1922" data-page="123">1922#123</span>after</p>'
		expect(convertToSearchText(stateFromHTML(html))[0].text).toBe('before after')
	})

	// The pattern is /[0-9]{4,4}#[0-9]{1,3}/g — exactly four digits, then #, then one
	// to three. A four-digit page number matches only its first three digits, leaving
	// the fourth behind as a stray character in the indexed text. No edition in the
	// project runs to four-digit pages today, so this is latent rather than live.
	test('a four-digit page number leaves a stray digit behind', () => {
		const html = '<p data-search-key="a">before<span data-edition="1922" data-page="1234">1922#1234</span>after</p>'
		expect(convertToSearchText(stateFromHTML(html))[0].text).toBe('before 4after')
	})
})

describe('indexed text content', () => {
	test('annotation link text is indexed as ordinary prose', () => {
		const [first] = convertToSearchText(stateFromHTML(ALL_ENTITY_TYPES))
		expect(first.text).toBe('Stately, plump Buck Mulligan came from the stairhead.')
	})

	test('external URL link text is indexed, the href is not', () => {
		const [, second] = convertToSearchText(stateFromHTML(ALL_ENTITY_TYPES))
		expect(second.text).toBe('See this edition for context.')
		expect(second.text).not.toContain('https://')
	})

	test('headings and blockquotes are indexed alongside paragraphs', () => {
		const texts = convertToSearchText(stateFromHTML(ALL_BLOCK_TYPES)).map(b => b.text)
		expect(texts).toEqual([
			'A plain paragraph.',
			'Heading one',
			'Heading two',
			'Heading three',
			'Introibo ad altare Dei.',
		])
	})

	test('an empty document produces no search text', () => {
		expect(convertToSearchText(stateFromHTML('<p data-search-key="a"></p>'))).toEqual([
			{ key: expect.any(String), text: '' },
		])
	})
})
