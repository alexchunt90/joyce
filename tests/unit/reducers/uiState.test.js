// The small, single-purpose slices. Each is a plain (state, action) => state with
// every branch returning, so these tests are mostly about pinning the contract
// so a future edit cannot quietly widen what an action affects.

import docType from '../../../src/reducers/docType'
import mode from '../../../src/reducers/mode'
import currentBlock from '../../../src/reducers/currentBlock'
import searchResults from '../../../src/reducers/searchResults'
import annotationNote from '../../../src/reducers/annotationNote'
import annotationTag from '../../../src/reducers/annotationTag'
import selectionState from '../../../src/reducers/selectionState'
import annotationNoteMedia from '../../../src/reducers/annotationNoteMedia'
import readerNoteMedia from '../../../src/reducers/readerNoteMedia'

describe('docType', () => {
	test('defaults to chapters', () => {
		expect(docType(undefined, { type: '@@INIT' })).toBe('chapters')
	})

	test.each([['SET_DOC_TYPE'], ['SET_EDITOR_DOC_TYPE'], ['SET_CURRENT_DOCUMENT']])(
		'%s adopts the action docType', type => {
			expect(docType('chapters', { type, docType: 'notes' })).toBe('notes')
		})

	test('ignores unrelated actions', () => {
		expect(docType('notes', { type: 'TOGGLE_HIGHLIGHT' })).toBe('notes')
	})
})

describe('mode', () => {
	test('defaults to READ_MODE', () => {
		expect(mode(undefined, { type: '@@INIT' })).toBe('READ_MODE')
	})

	test('SET_MODE adopts the requested mode', () => {
		expect(mode('READ_MODE', { type: 'SET_MODE', mode: 'PAGINATE_MODE' })).toBe('PAGINATE_MODE')
	})

	test('CREATE_DOCUMENT opens the editor', () => {
		expect(mode('READ_MODE', { type: 'CREATE_DOCUMENT' })).toBe('EDIT_MODE')
	})

	test.each([
		['CANCEL_EDIT', {}],
		['SAVE_DOCUMENT', { status: 'success' }],
		['GET_DOCUMENT_TEXT', { status: 'success', state: 'currentDocument' }],
	])('%s returns to READ_MODE', (type, rest) => {
		expect(mode('EDIT_MODE', { type, ...rest })).toBe('READ_MODE')
	})

	test('a failed save stays in the editor', () => {
		expect(mode('EDIT_MODE', { type: 'SAVE_DOCUMENT', status: 'error' })).toBe('EDIT_MODE')
	})

	test('loading an annotation note does not leave the editor', () => {
		expect(mode('EDIT_MODE', {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote',
		})).toBe('EDIT_MODE')
	})
})

describe('currentBlock', () => {
	const EMPTY = { id: undefined, key: undefined }

	test('defaults to an unset block', () => {
		expect(currentBlock(undefined, { type: '@@INIT' })).toEqual(EMPTY)
	})

	test('SET_CURRENT_BLOCK records the document and block key', () => {
		expect(currentBlock(EMPTY, { type: 'SET_CURRENT_BLOCK', id: 'doc-1', key: 'abc12' }))
			.toEqual({ id: 'doc-1', key: 'abc12' })
	})

	test('UNSET_CURRENT_BLOCK clears it', () => {
		expect(currentBlock({ id: 'doc-1', key: 'abc12' }, { type: 'UNSET_CURRENT_BLOCK' }))
			.toEqual(EMPTY)
	})
})

describe('searchResults', () => {
	test('defaults to an empty object', () => {
		expect(searchResults(undefined, { type: '@@INIT' })).toEqual({})
	})

	test('stores successful results', () => {
		const data = { chapters: [{ id: 'a' }] }
		expect(searchResults({}, { type: 'GET_SEARCH_RESULTS', status: 'success', data })).toBe(data)
	})

	test('keeps previous results when a search fails', () => {
		const previous = { chapters: [] }
		expect(searchResults(previous, { type: 'GET_SEARCH_RESULTS', status: 'error' })).toBe(previous)
	})
})

describe('annotationNote', () => {
	const NOTE = { id: 'note-1', title: 'Buck Mulligan' }

	test('defaults to an empty object', () => {
		expect(annotationNote(undefined, { type: '@@INIT' })).toEqual({})
	})

	test('stores a note fetched for the annotation modal', () => {
		expect(annotationNote({}, {
			type: 'GET_DOCUMENT_TEXT', status: 'success', docType: 'notes', state: 'annotationNote', data: NOTE,
		})).toBe(NOTE)
	})

	test('ignores a note fetched as the currentDocument', () => {
		expect(annotationNote({}, {
			type: 'GET_DOCUMENT_TEXT', status: 'success', docType: 'notes', state: 'currentDocument', data: NOTE,
		})).toEqual({})
	})

	test.each([['ADD_ANNOTATION'], ['ANNOTATION_CREATED']])('%s clears the note', type => {
		expect(annotationNote(NOTE, { type })).toEqual({})
	})
})

describe('annotationTag', () => {
	const TAG = { id: 'tag-1', color: 'FF0000' }

	test('defaults to an empty object', () => {
		expect(annotationTag(undefined, { type: '@@INIT' })).toEqual({})
	})

	test('SET_ANNOTATION_TAG stores the chosen tag', () => {
		expect(annotationTag({}, { type: 'SET_ANNOTATION_TAG', data: TAG })).toBe(TAG)
	})

	test.each([['SUBMIT_ANNOTATION'], ['CLEAR_ANNOTATION_TAG']])('%s clears the tag', type => {
		expect(annotationTag(TAG, { type })).toEqual({})
	})
})

describe('selectionState', () => {
	test('ADD_ANNOTATION stores the selection, ANNOTATION_CREATED clears it', () => {
		const selection = { anchorKey: 'abc' }
		expect(selectionState({}, { type: 'ADD_ANNOTATION', data: selection })).toBe(selection)
		expect(selectionState(selection, { type: 'ANNOTATION_CREATED' })).toEqual({})
	})
})

describe('note media slices', () => {
	const DOCS = [{ id: 'media-1' }]

	// Two slices share the GET_MEDIA_DOCS action and are told apart only by the
	// modalNote flag, so each must ignore the other's traffic.
	test('annotationNoteMedia takes modal media only', () => {
		expect(annotationNoteMedia([], { type: 'GET_MEDIA_DOCS', status: 'success', modalNote: true, data: DOCS }))
			.toBe(DOCS)
		expect(annotationNoteMedia([], { type: 'GET_MEDIA_DOCS', status: 'success', modalNote: false, data: DOCS }))
			.toEqual([])
	})

	test('readerNoteMedia takes reader media only', () => {
		expect(readerNoteMedia([], { type: 'GET_MEDIA_DOCS', status: 'success', modalNote: false, data: DOCS }))
			.toBe(DOCS)
		expect(readerNoteMedia([], { type: 'GET_MEDIA_DOCS', status: 'success', modalNote: true, data: DOCS }))
			.toEqual([])
	})

	test.each([['annotationNoteMedia', annotationNoteMedia], ['readerNoteMedia', readerNoteMedia]])(
		'%s clears when a new document is selected', (_name, reducer) => {
			expect(reducer(DOCS, { type: 'SET_CURRENT_DOCUMENT' })).toEqual([])
		})
})
