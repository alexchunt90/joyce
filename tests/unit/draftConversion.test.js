// The HTML <-> DraftJS round trip. Per the repo's own history this is the highest
// bug-density code in the app — double-escaped entities, search keys drifting out
// of sync with the HTML, page breaks leaking into search results. These tests pin
// the translation in both directions so a draft-convert upgrade cannot quietly
// change it.

import { convertToRaw } from 'draft-js'
import { stateFromHTML, stateToHTML } from '../../src/modules/draftConversion'
import { ALL_BLOCK_TYPES, ALL_ENTITY_TYPES, WITH_IMAGE } from '../fixtures/documents'

const raw = html => convertToRaw(stateFromHTML(html))
const entitiesOf = html => Object.values(raw(html).entityMap)
// Block keys are regenerated on every parse (see the final describe block), so
// comparisons of whole documents have to ignore them.
const withoutKeys = html => html.replace(/data-search-key="[^"]*"/g, 'data-search-key="KEY"')

describe('stateFromHTML — block types', () => {
	test.each([
		['<p data-search-key="a">x</p>', 'unstyled'],
		['<h1 data-search-key="a">x</h1>', 'header-one'],
		['<h2 data-search-key="a">x</h2>', 'header-two'],
		['<h3 data-search-key="a">x</h3>', 'header-three'],
		['<blockquote data-search-key="a">x</blockquote>', 'blockquote'],
		['<img data-search-key="a" src="/x.jpg"/>', 'atomic'],
	])('%s becomes a %s block', (html, expected) => {
		expect(raw(html).blocks[0].type).toBe(expected)
	})

	test('reads every block data attribute off the element', () => {
		const html = '<blockquote data-search-key="bq001" data-align="center" data-indent="true" data-custom-classes="verse italic">x</blockquote>'
		expect(raw(html).blocks[0].data).toEqual({
			key: 'bq001',
			align: 'center',
			indent: 'true',
			classes: ['verse', 'italic'],
			url: null,
			id: null,
		})
	})

	test('reads src and media id off an image block', () => {
		const { url, id } = raw(WITH_IMAGE).blocks[0].data
		expect(url).toBe('/img/media-1/img.jpg')
		expect(id).toBe('media-1')
	})

	test('an absent data-custom-classes yields an empty array, not undefined', () => {
		expect(raw('<p data-search-key="a">x</p>').blocks[0].data.classes).toEqual([])
	})
})

describe('stateFromHTML — entities', () => {
	test('an annotation link becomes a LINK entity carrying colour and tag', () => {
		const [entity] = entitiesOf(ALL_ENTITY_TYPES)
		expect(entity.type).toBe('LINK')
		expect(entity.mutability).toBe('MUTABLE')
		expect(entity.data).toEqual({ url: 'note-abc', color: 'FF0000', tag: 'tag-xyz' })
	})

	test('data-type="external_url" becomes an EXTERNAL_URL entity, not a LINK', () => {
		const entity = entitiesOf(ALL_ENTITY_TYPES)[1]
		expect(entity.type).toBe('EXTERNAL_URL')
		expect(entity.data).toEqual({ url: 'https://example.com/ulysses' })
	})

	test('a span becomes a PAGEBREAK entity carrying edition and page', () => {
		const entity = entitiesOf(ALL_ENTITY_TYPES)[2]
		expect(entity.type).toBe('PAGEBREAK')
		expect(entity.data).toEqual({ edition: '1922', pageNumber: '12' })
	})

	test('a link with no colour or tag falls back to blue and an empty tag', () => {
		const [entity] = entitiesOf('<p data-search-key="a"><a href="note-1">x</a></p>')
		expect(entity.data).toEqual({ url: 'note-1', color: '0000FF', tag: '' })
	})
})

describe('stateToHTML', () => {
	test.each([
		['unstyled', '<p data-search-key="a">x</p>', '<p'],
		['header-one', '<h1 data-search-key="a">x</h1>', '<h1'],
		['header-two', '<h2 data-search-key="a">x</h2>', '<h2'],
		['header-three', '<h3 data-search-key="a">x</h3>', '<h3'],
		['blockquote', '<blockquote data-search-key="a">x</blockquote>', '<blockquote'],
	])('%s renders back to %s', (_type, html, tag) => {
		expect(stateToHTML(stateFromHTML(html))).toContain(tag)
	})

	test('annotation links keep href, colour, tag and the annotation type marker', () => {
		const out = stateToHTML(stateFromHTML(ALL_ENTITY_TYPES))
		expect(out).toContain('href="note-abc"')
		expect(out).toContain('data-color="FF0000"')
		expect(out).toContain('data-tag="tag-xyz"')
		expect(out).toContain('data-type="annotation"')
	})

	test('external URLs keep their marker and are not written as annotations', () => {
		const out = stateToHTML(stateFromHTML(ALL_ENTITY_TYPES))
		expect(out).toContain('<a href="https://example.com/ulysses" data-type="external_url">')
	})

	test('page breaks keep edition, page and their marker text', () => {
		const out = stateToHTML(stateFromHTML(ALL_ENTITY_TYPES))
		expect(out).toContain('<span data-edition="1922" data-page="12">1922#12</span>')
	})

	test('images keep src and media id', () => {
		const out = stateToHTML(stateFromHTML(WITH_IMAGE))
		expect(out).toContain('src="/img/media-1/img.jpg"')
		expect(out).toContain('data-media-id="media-1"')
	})

	test('custom classes and indent survive the trip', () => {
		const out = stateToHTML(stateFromHTML(ALL_BLOCK_TYPES))
		expect(out).toContain('data-custom-classes="verse italic"')
		expect(out).toContain('data-indent="true"')
	})

	// blockToHTML writes `data-align={block.data.align || 'left'}`, so a block with no
	// alignment is emitted as explicitly left-aligned rather than having the attribute
	// omitted. Harmless, but it means output is always wider than input.
	test('blocks with no alignment are written as explicitly left-aligned', () => {
		expect(stateToHTML(stateFromHTML('<p data-search-key="a">x</p>'))).toContain('data-align="left"')
	})

	test('text content is not double-escaped', () => {
		const out = stateToHTML(stateFromHTML('<p data-search-key="a">Mulligan&#x27;s bowl &amp; razor</p>'))
		expect(out).not.toContain('&amp;amp;')
		expect(out).not.toContain('&amp;#x27;')
	})
})

describe('round trip stability', () => {
	test.each([
		['all block types', ALL_BLOCK_TYPES],
		['all entity types', ALL_ENTITY_TYPES],
		['an inline image', WITH_IMAGE],
	])('%s is stable once past the first pass', (_name, html) => {
		const pass1 = stateToHTML(stateFromHTML(html))
		const pass2 = stateToHTML(stateFromHTML(pass1))
		expect(withoutKeys(pass2)).toBe(withoutKeys(pass1))
	})

	test('no block is lost or duplicated across the trip', () => {
		const before = raw(ALL_BLOCK_TYPES).blocks
		const after = raw(stateToHTML(stateFromHTML(ALL_BLOCK_TYPES))).blocks
		expect(after).toHaveLength(before.length)
		expect(after.map(b => b.type)).toEqual(before.map(b => b.type))
		expect(after.map(b => b.text)).toEqual(before.map(b => b.text))
	})
})

describe('search key handling', () => {
	// Consequential behaviour, pinned deliberately rather than asserted as correct.
	//
	// stateFromHTML reads the incoming data-search-key into block.data.key, but
	// blockToHTML writes `data-search-key={block.key}` — the key DraftJS generated
	// when it parsed the document, not the one that came in. block.data.key is
	// therefore captured and never used, and every parse reassigns every key.
	//
	// Saving a chapter rewrites all of its search keys. search_text is regenerated
	// from the same contentState in the same save, so the stored document stays
	// internally consistent (that is the invariant convertToSearchText.test.js
	// guards). What does not survive is any *external* reference to a key: a
	// bookmarked /4#<key> deep link, or an anchor recorded before the last save.
	//
	// Preserving keys would mean emitting `block.data.key || block.key`.
	test('the incoming search key is read into block data', () => {
		expect(raw('<p data-search-key="original">x</p>').blocks[0].data.key).toBe('original')
	})

	test('but the emitted key is DraftJS-generated, not the incoming one', () => {
		const out = stateToHTML(stateFromHTML('<p data-search-key="original">x</p>'))
		expect(out).toContain('data-search-key=')
		expect(out).not.toContain('data-search-key="original"')
	})

	test('so keys differ on every parse of the same document', () => {
		const keysOf = html => raw(html).blocks.map(b => b.key)
		expect(keysOf(ALL_BLOCK_TYPES)).not.toEqual(keysOf(ALL_BLOCK_TYPES))
	})
})
