// editorConstructor builds and transforms the editorState the editor works on.
// The important invariant here is the one behind 16f9686, "Updated editorConstructor
// logic to fix annotations overwriting pagebreaks": applying or removing an
// annotation across a selection that contains a page break must leave that page
// break intact, because pagination depends on it and the reader's deep links do too.

import { EditorState, SelectionState, convertToRaw } from 'draft-js'
import { stateFromHTML } from '../../src/modules/draftConversion'
import editorConstructor from '../../src/modules/editorConstructor'
import { readerDecorator, editorDecorator } from '../../src/modules/editorSettings'

// applyEntityOverContentBlocks logs its progress on every call.
beforeAll(() => jest.spyOn(console, 'log').mockImplementation(() => {}))
afterAll(() => console.log.mockRestore())

const contentFrom = html => stateFromHTML(html)
const stateFrom = html => editorConstructor.returnEditorStateFromContentState(contentFrom(html))

const entityTypes = editorState =>
	Object.values(convertToRaw(editorState.getCurrentContent()).entityMap).map(e => e.type)

// A selection covering an entire single block.
const wholeBlock = contentState => {
	const block = contentState.getFirstBlock()
	return SelectionState.createEmpty(block.getKey())
		.set('anchorOffset', 0)
		.set('focusOffset', block.getLength())
}

const NOTE = { id: 'note-abc' }
const TAG = { color: 'FF0000', title: 'Homeric' }

describe('constructing editor state', () => {
	test('returns an empty editor', () => {
		expect(editorConstructor.returnNewEditorState().getCurrentContent().getPlainText()).toBe('')
	})

	test('builds state from HTML', () => {
		const state = editorConstructor.returnEditorStateFromHTML('<p data-search-key="a">Stately.</p>')
		expect(state.getCurrentContent().getPlainText()).toBe('Stately.')
	})

	test('swaps the decorator without disturbing content', () => {
		const before = stateFrom('<p data-search-key="a">Stately.</p>')
		const after = editorConstructor.returnEditorStateWithNewDecorator(before, editorDecorator)
		expect(after.getDecorator()).toBe(editorDecorator)
		expect(after.getCurrentContent()).toBe(before.getCurrentContent())
	})

	test('builds state from a blocks array and entity map', () => {
		const content = contentFrom('<p data-search-key="a">One.</p><p data-search-key="b">Two.</p>')
		const blocks = content.getBlocksAsArray()
		const state = editorConstructor.returnEditorStateFromBlocksArray(blocks, content.getEntityMap(), readerDecorator)
		expect(state.getCurrentContent().getPlainText()).toContain('One.')
		expect(state.getCurrentContent().getPlainText()).toContain('Two.')
	})
})

describe('checkBlockForEntities', () => {
	test('reports the offsets of page breaks in a block', () => {
		const content = contentFrom(
			'<p data-search-key="a">AAA<span data-edition="1922" data-page="1">1922#1</span>BBB</p>')
		const ranges = editorConstructor.checkBlockForEntities(content.getFirstBlock(), content)
		expect(ranges).toHaveLength(1)
		const [[start, end]] = ranges
		expect(start).toBe(3)
		expect(end).toBe(3 + '1922#1'.length)
	})

	test('reports nothing for a block with no page breaks', () => {
		const content = contentFrom('<p data-search-key="a">Just prose.</p>')
		expect(editorConstructor.checkBlockForEntities(content.getFirstBlock(), content)).toEqual([])
	})
})

describe('inserting a page break', () => {
	test('inserts the marker text and a PAGEBREAK entity', () => {
		const content = contentFrom('<p data-search-key="a">AAABBB</p>')
		const selection = SelectionState.createEmpty(content.getFirstBlock().getKey())
			.set('anchorOffset', 3).set('focusOffset', 3)
		const state = editorConstructor.returnEditorStateWithNewPageBreak(
			content, { year: 1922, number: 7, selectionState: selection }, readerDecorator)

		expect(state.getCurrentContent().getPlainText()).toBe('AAA1922#7BBB')
		expect(entityTypes(state)).toContain('PAGEBREAK')
	})

	test('records the edition and page number on the entity', () => {
		const content = contentFrom('<p data-search-key="a">AAABBB</p>')
		const selection = SelectionState.createEmpty(content.getFirstBlock().getKey())
			.set('anchorOffset', 3).set('focusOffset', 3)
		const state = editorConstructor.returnEditorStateWithNewPageBreak(
			content, { year: 1922, number: 7, selectionState: selection }, readerDecorator)

		const [entity] = Object.values(convertToRaw(state.getCurrentContent()).entityMap)
		expect(entity.data).toEqual({ edition: 1922, pageNumber: 7 })
	})
})

describe('adding an annotation', () => {
	test('creates a LINK entity carrying the note id, colour and tag', () => {
		const content = contentFrom('<p data-search-key="a">Buck Mulligan</p>')
		const state = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})

		const link = Object.values(convertToRaw(state.getCurrentContent()).entityMap)
			.find(e => e.type === 'LINK')
		expect(link.data).toEqual({ url: 'note-abc', color: 'FF0000', tag: 'Homeric' })
	})

	test('leaves the underlying text unchanged', () => {
		const content = contentFrom('<p data-search-key="a">Buck Mulligan</p>')
		const state = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})
		expect(state.getCurrentContent().getPlainText()).toBe('Buck Mulligan')
	})
})

// The regression this module was changed for. Modifier.applyEntity over a whole
// selection would replace every entity in range, page breaks included;
// applyEntityOverContentBlocks walks around them instead.
describe('page breaks survive annotation edits (guards 16f9686)', () => {
	const WITH_BREAK =
		'<p data-search-key="a">Before the break<span data-edition="1922" data-page="1">1922#1</span>after the break</p>'

	test('annotating across a page break keeps the PAGEBREAK entity', () => {
		const content = contentFrom(WITH_BREAK)
		const state = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})
		expect(entityTypes(state)).toContain('PAGEBREAK')
		expect(entityTypes(state)).toContain('LINK')
	})

	test('the page break text is left in place', () => {
		const content = contentFrom(WITH_BREAK)
		const state = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})
		expect(state.getCurrentContent().getPlainText()).toContain('1922#1')
	})

	test('the page break is still findable after annotating', () => {
		const content = contentFrom(WITH_BREAK)
		const state = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})
		const newContent = state.getCurrentContent()
		expect(editorConstructor.checkBlockForEntities(newContent.getFirstBlock(), newContent))
			.toHaveLength(1)
	})

	test('removing an annotation across a page break keeps the PAGEBREAK', () => {
		const content = contentFrom(WITH_BREAK)
		const annotated = editorConstructor.returnEditorStateWithNewAnnotation(content, {
			annotationNote: NOTE, annotationTag: TAG, selectionState: wholeBlock(content),
		})
		const cleared = editorConstructor.returnEditorStateWithoutAnnotation({
			editorState: annotated,
			selectionState: wholeBlock(annotated.getCurrentContent()),
		})

		const newContent = cleared.getCurrentContent()
		expect(editorConstructor.checkBlockForEntities(newContent.getFirstBlock(), newContent))
			.toHaveLength(1)
		expect(newContent.getPlainText()).toContain('1922#1')
	})
})

describe('external URLs', () => {
	test('creates an EXTERNAL_URL entity over the selection', () => {
		const content = contentFrom('<p data-search-key="a">this edition</p>')
		const base = editorConstructor.returnEditorStateFromContentState(content)
		const withSelection = EditorState.forceSelection(base, wholeBlock(content))
		const state = editorConstructor.returnEditorStateWithNewExternalURL(
			withSelection, 'https://example.com')

		const entity = Object.values(convertToRaw(state.getCurrentContent()).entityMap)
			.find(e => e.type === 'EXTERNAL_URL')
		expect(entity.data).toEqual({ url: 'https://example.com' })
	})
})
