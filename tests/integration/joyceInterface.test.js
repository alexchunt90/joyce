// joyceInterface is the app's orchestrator: it turns user intent into API requests
// and editor state. SET_CURRENT_DOCUMENT becomes a fetch, a fetched document becomes
// a DraftJS editorState, a submitted edit becomes the payload posted to Elasticsearch.
//
// It was the last middleware with no coverage, and it is where the shape of every
// saved document is decided — the per-docType fields below are the only place that
// mapping exists.
//
// bootstrap is mocked: two cases reach into the live DOM to dismiss a modal, which is
// view behaviour and not what these tests are about.

import { SelectionState } from 'draft-js'

import joyceInterface from '../../src/middleware/joyceInterface'
import editorConstructor from '../../src/modules/editorConstructor'
import { readerDecorator } from '../../src/modules/editorSettings'
import {
	buildStore, createRecorder, seedDocumentLists,
	CHAPTERS, NOTES, INFO, TAGS, MEDIA, EDITIONS,
} from '../helpers/store'

// Named with the mock prefix because jest hoists jest.mock above the imports, and
// the factory may only reference out-of-scope variables whose names start with "mock".
const mockHide = jest.fn()
jest.mock('bootstrap', () => ({
	Modal: { getInstance: () => ({ hide: mockHide }) },
}))

const setup = (path = '/', { seed = true } = {}) => {
	const recorder = createRecorder()
	const harness = buildStore([joyceInterface], { path, observer: recorder.middleware })
	if (seed) seedDocumentLists(harness.store)
	recorder.clear()
	return { ...harness, recorder }
}

const editorStateFrom = html =>
	editorConstructor.returnEditorStateFromHTML(html, readerDecorator)

const LOGGED_IN = { type: 'USER_LOGIN_REFRESH', user_name: 'Alex' }

// The inputs object the editor submits. validateSubmittedDocument always reads
// documentTitle, so every case needs it.
const inputs = (overrides = {}) => ({ documentTitle: 'Telemachus', ...overrides })

const submitAction = (docType, overrides = {}) => ({
	type: 'SUBMIT_DOCUMENT_EDIT',
	docType,
	inputs: inputs(overrides.inputs),
	currentDocument: overrides.currentDocument || {},
	editorState: overrides.editorState || editorStateFrom('<p data-search-key="a">Stately.</p>'),
})

const saved = recorder => recorder.ofType('SAVE_DOCUMENT')[0]

beforeEach(() => mockHide.mockClear())

describe('loading a document', () => {
	test('selecting a document requests its full text', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'SET_CURRENT_DOCUMENT', id: NOTES[0].id, docType: 'notes' })

		const [request] = recorder.ofType('GET_DOCUMENT_TEXT')
		expect(request).toMatchObject({
			id: NOTES[0].id, docType: 'notes', state: 'currentDocument', status: 'request',
		})
	})

	test('a fetched document becomes an editor state', () => {
		// Built here rather than in the reducer so returnEditorStateFromHTML is called
		// once and the result reaches both the editorState reducer and joycePaginate.
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'chapters', data: { id: 'x', html_source: '<p data-search-key="a">Stately.</p>' },
		})

		const [set] = recorder.ofType('SET_EDITOR_STATE')
		expect(set.data.getCurrentContent().getPlainText()).toBe('Stately.')
	})

	test('a fetch for the annotation note does not replace the main editor state', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote',
			docType: 'notes', data: { id: 'n', html_source: '<p>x</p>', media_doc_ids: [] },
		})
		expect(recorder.ofType('SET_EDITOR_STATE')).toHaveLength(0)
	})

	test('a note carrying media requests those media documents', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'notes',
			data: { id: 'n', html_source: '<p>x</p>', media_doc_ids: ['media-1', 'media-2'] },
		})

		const [request] = recorder.ofType('GET_MEDIA_DOCS')
		expect(request.media_doc_ids).toEqual(['media-1', 'media-2'])
	})

	test('media for the modal note is flagged separately from the reader note', () => {
		// annotationNoteMedia and readerNoteMedia are two slices told apart by this flag.
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote',
			docType: 'notes', data: { id: 'n', html_source: '<p>x</p>', media_doc_ids: ['m'] },
		})
		expect(recorder.ofType('GET_MEDIA_DOCS')[0].modalNote).toBe(true)
	})

	test('a note with no media requests none', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'notes', data: { id: 'n', html_source: '<p>x</p>', media_doc_ids: [] },
		})
		expect(recorder.ofType('GET_MEDIA_DOCS')).toHaveLength(0)
	})
})

describe('submitting an edit', () => {
	test('a valid submission is saved', () => {
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		recorder.clear()
		store.dispatch(submitAction('chapters'))

		expect(saved(recorder)).toMatchObject({ docType: 'chapters', status: 'request' })
	})

	test('the saved payload carries the title, HTML and search text', () => {
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		store.dispatch(submitAction('chapters'))

		const { data } = saved(recorder)
		expect(data.title).toBe('Telemachus')
		expect(data.html_source).toContain('Stately.')
		expect(data.search_text).toEqual([{ key: expect.any(String), text: 'Stately.' }])
	})

	test('the search text keys match the HTML that is saved alongside them', () => {
		// The invariant behind 55e813c, asserted at the point the payload is built
		// rather than only on the conversion functions in isolation.
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		store.dispatch(submitAction('chapters', {
			editorState: editorStateFrom(
				'<p data-search-key="k1">One.</p><p data-search-key="k2">Two.</p>'),
		}))

		const { data } = saved(recorder)
		const htmlKeys = [...data.html_source.matchAll(/data-search-key="([^"]*)"/g)].map(m => m[1])
		expect(data.search_text.map(b => b.key)).toEqual(htmlKeys)
	})

	test('an invalid submission returns errors instead of saving', () => {
		const { store, recorder } = setup()
		// Not logged in.
		store.dispatch(submitAction('chapters'))

		expect(recorder.ofType('SAVE_DOCUMENT')).toHaveLength(0)
		expect(recorder.ofType('RETURN_EDITOR_VALIDATION_ERRORS')[0].errors)
			.toContain('You must log in to make edits.')
	})

	test('an existing document is saved against its id', () => {
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		store.dispatch(submitAction('notes', {
			currentDocument: { id: NOTES[0].id },
			inputs: { noteMediaSelection: [] },
		}))
		expect(saved(recorder).id).toBe(NOTES[0].id)
	})

	test('a new document is saved with no id', () => {
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		store.dispatch(submitAction('notes', { inputs: { noteMediaSelection: [] } }))
		expect(saved(recorder).id).toBeNull()
	})
})

describe('the per-docType save payload', () => {
	// This switch is the only place the shape of each saved document is defined.
	const submitAs = (docType, overrides) => {
		const { store, recorder } = setup()
		store.dispatch(LOGGED_IN)
		store.dispatch(submitAction(docType, overrides))
		return saved(recorder).data
	}

	test('notes carry their selected media', () => {
		const data = submitAs('notes', { inputs: { noteMediaSelection: ['media-1'] } })
		expect(data.media_doc_ids).toEqual(['media-1'])
	})

	test('info pages carry their sort number', () => {
		const data = submitAs('info', { inputs: { documentNumber: '3' } })
		expect(data.number).toBe('3')
	})

	test('tags carry their colour', () => {
		const data = submitAs('tags', { inputs: { colorPicker: 'FF0000' } })
		expect(data.color).toBe('FF0000')
	})

	test('editions carry their year', () => {
		const data = submitAs('editions', { inputs: { editionYear: '1922' } })
		expect(data.year).toBe('1922')
	})

	test('media carry the upload and the external URL', () => {
		const data = submitAs('media', {
			currentDocument: { id: MEDIA[0].id },
			inputs: { uploadFile: undefined, externalURL: 'https://youtu.be/x' },
		})
		expect(data.youtubeURL).toBe('https://youtu.be/x')
	})

	test('a new chapter is numbered after the last existing one', () => {
		const data = submitAs('chapters')
		expect(data.number).toBe(CHAPTERS.length + 1)
	})

	test('an existing chapter keeps its number', () => {
		const data = submitAs('chapters', { currentDocument: { id: CHAPTERS[1].id, number: 4 } })
		expect(data.number).toBe(4)
	})
})

describe('deleting and cancelling', () => {
	test('deleting the current document requests the delete', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'DELETE_CURRENT_DOCUMENT', id: NOTES[0].id, docType: 'notes' })
		expect(recorder.ofType('DELETE_DOCUMENT')[0])
			.toMatchObject({ id: NOTES[0].id, docType: 'notes', status: 'request' })
	})

	test('cancelling reloads the document being edited', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'chapters', data: { id: CHAPTERS[0].id, html_source: '<p>x</p>' },
		})
		recorder.clear()
		store.dispatch({ type: 'CANCEL_EDIT' })

		expect(recorder.ofType('GET_DOCUMENT_TEXT')[0]).toMatchObject({
			id: CHAPTERS[0].id, state: 'currentDocument',
		})
	})

	test('cancelling a new document falls back to the first of its type', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'CANCEL_EDIT' })
		expect(recorder.ofType('GET_DOCUMENT_TEXT')[0].id).toBe(CHAPTERS[0].id)
	})

	// Pinned as current behaviour, not asserted as correct. The SET_DOC_TYPE case
	// guards on `action.docType !== docType`, but joyceInterface calls next(action)
	// before reading state, so the docType reducer has already applied the change and
	// the two are always equal. The guard can never be true and
	// clearCurrentDocument is never dispatched from here.
	//
	// currentDocument is still cleared on SET_EDITOR_DOC_TYPE by its own reducer, and
	// joyceRouter selects a new document on navigation, so the visible effect is
	// limited — switching docType leaves the previous document current until
	// something else replaces it. See plans/hygiene.md.
	test.each([['notes'], ['chapters']])(
		'SET_DOC_TYPE to %s never clears the current document (dead guard)', docType => {
			const { store, recorder } = setup()
			store.dispatch({ type: 'SET_DOC_TYPE', docType })
			expect(recorder.ofType('CLEAR_CURRENT_DOCUMENT')).toHaveLength(0)
		})

	test('the docType reducer has already applied the change when the guard runs', () => {
		// The mechanism behind the dead guard, pinned so a fix has something to break.
		const { store } = setup()
		store.dispatch({ type: 'SET_DOC_TYPE', docType: 'notes' })
		expect(store.getState().docType).toBe('notes')
	})
})

describe('annotations and external URLs', () => {
	test('clicking an annotation link loads the note for the modal', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'SELECT_ANNOTATION_NOTE', id: NOTES[0].id })
		expect(recorder.ofType('GET_DOCUMENT_TEXT')[0])
			.toMatchObject({ id: NOTES[0].id, docType: 'notes', state: 'annotationNote' })
	})

	test('a valid annotation is applied to the editor state', () => {
		const { store, recorder } = setup()
		const editorState = editorStateFrom('<p data-search-key="a">Buck Mulligan</p>')
		const contentState = editorState.getCurrentContent()
		const block = contentState.getFirstBlock()

		store.dispatch({
			type: 'SUBMIT_ANNOTATION',
			editorState,
			annotationNote: { id: 'note-abc' },
			annotationTag: { id: 'tag-1', color: 'FF0000', title: 'Homeric' },
			docType: 'chapters',
			selectionState: SelectionState.createEmpty(block.getKey())
				.set('anchorOffset', 0).set('focusOffset', block.getLength()),
		})

		expect(recorder.ofType('ANNOTATION_CREATED')).toHaveLength(1)
	})

	test('an annotation with no note is rejected without touching the editor', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'SUBMIT_ANNOTATION',
			editorState: editorStateFrom('<p data-search-key="a">x</p>'),
			annotationNote: {}, annotationTag: {}, docType: 'chapters',
		})
		expect(recorder.ofType('ANNOTATION_CREATED')).toHaveLength(0)
	})

	test('a rejected annotation leaves the modal open', () => {
		const { store } = setup()
		store.dispatch({
			type: 'SUBMIT_ANNOTATION',
			editorState: editorStateFrom('<p data-search-key="a">x</p>'),
			annotationNote: {}, annotationTag: {}, docType: 'chapters',
		})
		expect(mockHide).not.toHaveBeenCalled()
	})

	test('submitting an external URL applies it to the editor state', () => {
		const { store, recorder } = setup()
		const editorState = editorStateFrom('<p data-search-key="a">this edition</p>')
		store.dispatch({
			type: 'SUBMIT_EXTERNAL_URL', editorState, externalURL: 'https://example.com',
		})
		expect(recorder.ofType('EXTERNAL_URL_CREATED')).toHaveLength(1)
	})
})

describe('search', () => {
	test('a search request carries the input, doc types and result count', () => {
		const { store, recorder } = setup()
		store.dispatch({
			type: 'CLICK_SEARCH',
			searchInput: 'stately', docTypes: { chapters: true }, resultCount: 5,
		})
		expect(recorder.ofType('GET_SEARCH_RESULTS')[0].data).toEqual({
			searchInput: 'stately', docTypes: { chapters: true }, resultCount: 5,
		})
	})
})

// Three inputs that crash the middleware outright. A throw here escapes the dispatch,
// so the action never completes and the editor is left wedged — these are not silent
// misbehaviour. All are pinned as current behaviour; see plans/hygiene.md.
describe('inputs that throw', () => {
	// joyceInterface calls documentsOfDocType with six arguments:
	//   (docType, chapters, notes, tags, editions, media)
	// but the signature takes seven, with `info` last. So `docs` is undefined whenever
	// docType is 'info', even though state.info is right there and never read.
	// Cancelling an edit then indexes into undefined.
	test('cancelling an edit on an info page throws', () => {
		const { store } = setup()
		store.dispatch({ type: 'SET_DOC_TYPE', docType: 'info' })
		expect(() => store.dispatch({ type: 'CANCEL_EDIT' }))
			.toThrow(/Cannot read properties of undefined/)
	})

	test('every other docType resolves its document list', () => {
		// The same call works for the five docTypes that are passed positionally,
		// which is why the gap is easy to miss.
		for (const docType of ['chapters', 'notes', 'tags', 'editions', 'media']) {
			const { store } = setup()
			store.dispatch({ type: 'SET_DOC_TYPE', docType })
			expect(() => store.dispatch({ type: 'CANCEL_EDIT' })).not.toThrow()
		}
	})

	// media_doc_ids is read without a guard. The index mapping declares the field but
	// does not require it, so a note saved before it existed has no such key.
	test('loading a note with no media_doc_ids field throws', () => {
		const { store } = setup()
		expect(() => store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'notes', data: { id: 'n', html_source: '<p>x</p>' },
		})).toThrow(/Cannot read properties of undefined/)
	})

	// docs[0].id with nothing in the list — a fresh install, or a docType whose
	// documents have all been deleted.
	test('cancelling a new document with an empty document list throws', () => {
		const { store } = setup('/', { seed: false })
		expect(() => store.dispatch({ type: 'CANCEL_EDIT' }))
			.toThrow(/Cannot read properties of undefined/)
	})
})
