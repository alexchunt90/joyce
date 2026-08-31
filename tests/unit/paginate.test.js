// src/modules/paginate.js walks a contentState looking for PAGEBREAK entities of a
// given edition and slices the blocks into numbered pages, splitting any block a
// break falls inside. Its own header comment calls it "a big clever recursive
// function" that the author declined to rewrite, so pinning its behaviour matters
// more here than almost anywhere else in the app.

import { stateFromHTML } from '../../src/modules/draftConversion'
import editorConstructor from '../../src/modules/editorConstructor'
import paginate from '../../src/modules/paginate'
import { PAGINATED_1922, PAGINATED_1961, EDITION_1922 } from '../fixtures/documents'

const paginateHTML = (html, edition = EDITION_1922) =>
	paginate(editorConstructor.returnEditorStateFromContentState(stateFromHTML(html)), edition)

const pageTexts = result => result.doc.map(page => page.blocks.map(b => b.getText()))

describe('the paginated document envelope', () => {
	const result = paginateHTML(PAGINATED_1922)

	test('reports completion', () => {
		expect(result.status).toBe('complete')
	})

	test('carries the edition year and title through', () => {
		expect(result.year).toBe(1922)
		expect(result.title).toBe('Shakespeare and Company')
	})

	test('exports an entityMap so pages can be rebuilt into contentStates', () => {
		expect(result.entityMap).toBeDefined()
	})
})

describe('splitting on page breaks', () => {
	const result = paginateHTML(PAGINATED_1922)

	test('emits one page per break, plus one for the content after the last', () => {
		expect(result.doc).toHaveLength(4)
	})

	test('numbers each page from the break that closes it', () => {
		// The fourth has no closing break and is numbered last + 1.
		expect(result.doc.map(p => p.number)).toEqual(['1', '2', '3', '4'])
	})

	test('page numbers are strings, including the trailing one', () => {
		// paginationState looks pages up with ===, and every other number comes from
		// the data-page attribute as a string, so the trailing one must match.
		for (const page of result.doc) {
			expect(typeof page.number).toBe('string')
		}
	})

	test('a break mid-paragraph splits the block across two pages', () => {
		const [pageOne, pageTwo] = pageTexts(result)
		expect(pageOne[0]).toContain('Page one opening line.')
		expect(pageTwo[0]).toContain('Page two begins here.')
	})

	test('every page carries at least one block', () => {
		for (const page of result.doc) {
			expect(page.blocks.length).toBeGreaterThan(0)
		}
	})

	test('no text is duplicated across pages', () => {
		const all = pageTexts(result).flat().join(' ')
		expect(all.match(/Page one opening line\./g)).toHaveLength(1)
		expect(all.match(/Still on page two\./g)).toHaveLength(1)
	})
})

describe('breaks belonging to another edition', () => {
	test('are ignored, producing no pages', () => {
		expect(paginateHTML(PAGINATED_1961, EDITION_1922).doc).toEqual([])
	})

	test('are matched by year as a string, not a number', () => {
		// paginate compares entity.data.edition === edition.year.toString(), so an
		// edition whose year is already a string still matches.
		const asString = paginateHTML(PAGINATED_1922, { year: '1922', title: 'SC' })
		expect(asString.doc).toHaveLength(4)
	})
})

// The two ways content silently fails to reach a page. Neither is a crash, so
// neither is visible without a test; both are pinned rather than fixed.
describe('content that does not reach a page', () => {
	// Regression guard. A page takes its number from the break that closes it, so the
	// run of blocks after the final break had none and was discarded — in a fully
	// paginated chapter that is the entire last page, because in print nothing marks
	// the end of the final page. It is now emitted, numbered last + 1.
	test('content after the final break reaches the last page', () => {
		const pages = pageTexts(paginateHTML(PAGINATED_1922))
		const lastPage = pages[pages.length - 1].join(' ')
		expect(lastPage).toContain('and the remainder after the break.')
		expect(lastPage).toContain('Trailing text with no break at all.')
	})

	test('every block of the document reaches some page', () => {
		const shown = pageTexts(paginateHTML(PAGINATED_1922)).flat().join('\n')
		for (const fragment of [
			'Page one opening line.',
			'Page two begins here.',
			'Still on page two.',
			'Page three begins.',
			'Start of three',
			'and the remainder after the break.',
			'Trailing text with no break at all.',
		]) {
			expect(shown).toContain(fragment)
		}
	})

	// Still outstanding, and separate from the trailing-page fix above. The block split
	// only happens when the break ends before the end of the block
	// (getLength() !== pageBreak.end). A break sitting at the very end of a block
	// pushes nothing, so that block is dropped and its page comes out empty. The
	// blocks that follow it now do reach a page. See plans/hygiene.md.
	test('a block whose break sits at its very end is still dropped', () => {
		const html =
			'<p data-search-key="a">Opening text.<span data-edition="1922" data-page="1">1922#1</span></p>' +
			'<p data-search-key="b">Following paragraph.</p>'
		const result = paginateHTML(html)
		expect(result.doc).toHaveLength(2)
		expect(result.doc[0].blocks).toHaveLength(0)
		expect(result.doc[1].blocks.map(b => b.getText())).toEqual(['Following paragraph.'])
	})

	test('a document with no breaks at all yields no pages', () => {
		const html = '<p data-search-key="a">Just prose, no breaks.</p>'
		expect(paginateHTML(html).doc).toEqual([])
	})
})

describe('the recursion limit', () => {
	// recursivePagination bails out at 500 calls and returns an 'in_progress' object;
	// limitRecursion catches that and re-enters, resetting the call stack. Documents
	// long enough to cross that boundary are the reason the mechanism exists, so it
	// needs a test that actually crosses it.
	const longDocument = count => {
		const blocks = []
		for (let i = 0; i < count; i++) {
			blocks.push(
				`<p data-search-key="k${i}">Block ${i} before<span data-edition="1922" data-page="${i + 1}">1922#${i + 1}</span>after</p>`
			)
		}
		return blocks.join('')
	}

	// Each generated block carries a break with text after it, so the trailing page
	// adds one more than the break count.
	test('a document just under the limit paginates in one pass', () => {
		const result = paginateHTML(longDocument(100))
		expect(result.status).toBe('complete')
		expect(result.doc).toHaveLength(101)
	})

	test('a document past the 500-call limit still completes', () => {
		const result = paginateHTML(longDocument(600))
		expect(result.status).toBe('complete')
		expect(result.doc).toHaveLength(601)
	})

	test('page numbers stay in order across the recursion reset', () => {
		const numbers = paginateHTML(longDocument(600)).doc.map(p => Number(p.number))
		expect(numbers[0]).toBe(1)
		expect(numbers[600]).toBe(601)
		expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
	})
})
