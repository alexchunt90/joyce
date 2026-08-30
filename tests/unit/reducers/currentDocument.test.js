// currentDocument holds the document the reader or editor is presently showing.
// combineReducers throws if a slice reducer ever returns undefined, so "always
// return a value on every path" is a hard requirement here, not a style point.

import currentDocument from '../../../src/reducers/currentDocument'

const DOC = { id: 'doc-1', number: 1, title: 'Telemachus', html_source: '<p>Stately</p>' }
const BLANK = { id: null, number: null, title: '', html_source: '' }

describe('currentDocument', () => {
	test('defaults to an empty object', () => {
		expect(currentDocument(undefined, { type: '@@INIT' })).toEqual({})
	})

	test('stores a successfully fetched currentDocument', () => {
		expect(currentDocument({}, {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument', data: DOC,
		})).toEqual(DOC)
	})

	test('clears while a currentDocument fetch is in flight', () => {
		expect(currentDocument(DOC, {
			type: 'GET_DOCUMENT_TEXT', status: 'request', state: 'currentDocument',
		})).toEqual({})
	})

	test('ignores fetches for the annotation note, which has its own slice', () => {
		expect(currentDocument(DOC, {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote', data: { id: 'note-9' },
		})).toBe(DOC)
	})

	test.each([['CLEAR_CURRENT_DOCUMENT'], ['SET_EDITOR_DOC_TYPE']])('%s clears the document', type => {
		expect(currentDocument(DOC, { type })).toEqual({})
	})

	test('CREATE_DOCUMENT installs a blank document for the editor', () => {
		expect(currentDocument(DOC, { type: 'CREATE_DOCUMENT' })).toEqual(BLANK)
	})

	test('deleting the last document clears the current one', () => {
		expect(currentDocument(DOC, { type: 'DELETE_DOCUMENT', status: 'success', data: [] })).toEqual({})
	})

	test('ignores unrelated actions', () => {
		expect(currentDocument(DOC, { type: 'TOGGLE_HIGHLIGHT' })).toBe(DOC)
	})

	// Regression guard. This case previously ended in `break`, which falls off the end
	// of the function and returns undefined; combineReducers treats that as fatal
	// ("the slice reducer for key 'currentDocument' returned undefined"), so deleting
	// a document while others remained crashed the store. It now returns state.
	test('deleting one of several documents leaves the current one alone', () => {
		const result = currentDocument(DOC, {
			type: 'DELETE_DOCUMENT', status: 'success', data: [{ id: 'doc-2' }],
		})
		expect(result).toBeDefined()
		expect(result).toBe(DOC)
	})
})
