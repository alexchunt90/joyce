// joycePaginate drives the reader's paginated view: it decides when to paginate a
// chapter, which edition to use, and when a previously paginated edition can be
// reused instead of recomputed. Pagination is the most expensive thing the frontend
// does — paginate() walks every block of a chapter — so when it runs matters.
//
// It was the last middleware with no coverage.

import joycePaginate from '../../src/middleware/joycePaginate'
import editorConstructor from '../../src/modules/editorConstructor'
import { buildStore, createRecorder, seedDocumentLists, EDITIONS } from '../helpers/store'

const setup = ({ seed = true } = {}) => {
	const recorder = createRecorder()
	const harness = buildStore([joycePaginate], { observer: recorder.middleware })
	if (seed) seedDocumentLists(harness.store)
	recorder.clear()
	return { ...harness, recorder }
}

const EDITION = { id: 'edition-1922', year: 1922, title: 'Shakespeare and Company' }

// A chapter carrying two 1922 page breaks.
const PAGINATED_HTML =
	'<p data-search-key="a">Page one.<span data-edition="1922" data-page="1">1922#1</span>Page two.</p>' +
	'<p data-search-key="b">Still two.<span data-edition="1922" data-page="2">1922#2</span>Page three.</p>'

// The seeded EDITIONS fixture is the 1922 edition, so the same breaks serve both.
const EDITIONS_1922_HTML = PAGINATED_HTML

const editorStateFrom = html => editorConstructor.returnEditorStateFromHTML(html)

const loadEditor = (store, html = PAGINATED_HTML) =>
	store.dispatch({ type: 'SET_EDITOR_STATE', data: editorStateFrom(html) })

describe('triggering pagination after a chapter loads', () => {
	beforeEach(() => jest.useFakeTimers())
	afterEach(() => jest.useRealTimers())

	test('a loaded chapter schedules a pagination pass', () => {
		// Deferred with setTimeout so displaying the chapter is not held up by
		// paginating it.
		const { store, recorder } = setup()
		loadEditor(store)
		expect(recorder.ofType('LOAD_PAGINATION')).toHaveLength(0)

		jest.runAllTimers()
		expect(recorder.ofType('LOAD_PAGINATION')).toHaveLength(1)
	})

	test('loading any other docType schedules nothing', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'SET_DOC_TYPE', docType: 'notes' })
		loadEditor(store)
		jest.runAllTimers()
		expect(recorder.ofType('LOAD_PAGINATION')).toHaveLength(0)
	})
})

describe('choosing the edition to paginate', () => {
	test('the first edition is selected once editions have loaded', () => {
		// A chapter is loaded first: selecting an edition paginates immediately, and
		// paginating the blank default editorState hits the empty-page-list crash
		// pinned below.
		const { store, recorder } = setup()
		loadEditor(store, EDITIONS_1922_HTML)
		recorder.clear()
		store.dispatch({ type: 'LOAD_PAGINATION' })

		const [chosen] = recorder.ofType('SET_PAGINATION_EDITION')
		expect(chosen.data).toEqual(EDITIONS[0])
	})

	test('nothing is selected before editions have loaded', () => {
		const { store, recorder } = setup({ seed: false })
		store.dispatch({ type: 'LOAD_PAGINATION' })
		expect(recorder.ofType('SET_PAGINATION_EDITION')).toHaveLength(0)
	})

	test('nothing is selected outside chapters', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'SET_DOC_TYPE', docType: 'notes' })
		recorder.clear()
		store.dispatch({ type: 'LOAD_PAGINATION' })
		expect(recorder.ofType('SET_PAGINATION_EDITION')).toHaveLength(0)
	})
})

describe('paginating an edition', () => {
	test('selecting an unpaginated edition paginates the current chapter', () => {
		const { store, recorder } = setup()
		loadEditor(store)
		recorder.clear()
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })

		const [added] = recorder.ofType('ADD_PAGINATED_DOCUMENT')
		expect(added.data.year).toBe(1922)
		expect(added.data.doc.length).toBeGreaterThan(0)
	})

	test('the paginated document is stored against its year', () => {
		const { store } = setup()
		loadEditor(store)
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })
		expect(store.getState().paginationState.documents[1922]).toBeDefined()
	})

	test('an edition already paginated is not paginated again', () => {
		// paginate() walks every block of the chapter, so re-running it on an edition
		// already in the store would be the most expensive no-op in the app.
		const { store, recorder } = setup()
		loadEditor(store)
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })
		recorder.clear()

		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(0)
	})
})

describe('switching between editions', () => {
	test('an edition already paginated is re-rendered from the store', () => {
		const { store, recorder } = setup()
		loadEditor(store)
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })
		recorder.clear()

		store.dispatch({ type: 'CHOOSE_PAGINATION_EDITION', data: EDITION })
		expect(recorder.ofType('CHANGE_PAGINATED_DOCUMENT')).toHaveLength(1)
		expect(recorder.ofType('SET_PAGINATION_EDITION')).toHaveLength(0)
	})

	test('an edition not yet paginated is selected for pagination', () => {
		const { store, recorder } = setup()
		loadEditor(store)
		recorder.clear()

		store.dispatch({ type: 'CHOOSE_PAGINATION_EDITION', data: EDITION })
		expect(recorder.ofType('SET_PAGINATION_EDITION')).toHaveLength(1)
		expect(recorder.ofType('CHANGE_PAGINATED_DOCUMENT')).toHaveLength(0)
	})
})

describe('paginating once the editions list arrives', () => {
	// The race the source comments on: the chapter and the editions list load
	// independently, and pagination needs both.
	const loadCurrentDocument = store => store.dispatch({
		type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
		docType: 'chapters', data: { id: 'c1', number: 1, html_source: PAGINATED_HTML },
	})

	test('editions arriving after the chapter paginates it', () => {
		const { store, recorder } = setup({ seed: false })
		loadCurrentDocument(store)
		recorder.clear()

		store.dispatch({
			type: 'GET_DOCUMENT_LIST', status: 'success', docType: 'editions', data: [EDITION],
		})
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(1)
	})

	test('editions arriving before the chapter paginate nothing', () => {
		const { store, recorder } = setup({ seed: false })
		store.dispatch({
			type: 'GET_DOCUMENT_LIST', status: 'success', docType: 'editions', data: [EDITION],
		})
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(0)
	})

	test('another docType list arriving paginates nothing', () => {
		const { store, recorder } = setup({ seed: false })
		loadCurrentDocument(store)
		recorder.clear()
		store.dispatch({
			type: 'GET_DOCUMENT_LIST', status: 'success', docType: 'notes', data: [],
		})
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(0)
	})
})

describe('page break selection in the editor', () => {
	test('editor updates outside paginate mode are left alone', () => {
		const { store, recorder } = setup()
		store.dispatch({ type: 'UPDATE_EDITOR_STATE', data: editorStateFrom(PAGINATED_HTML) })
		expect(recorder.ofType('UPDATE_EDITOR_STATE')).toHaveLength(1)
	})

	test('in paginate mode an update with no page break selection is left alone', () => {
		// returnEditorStateWithExpandedPageBreakSelection returns undefined unless the
		// cursor is inside a break, and only a defined result is dispatched onward.
		const { store, recorder } = setup()
		store.dispatch({ type: 'SET_MODE', mode: 'PAGINATE_MODE' })
		recorder.clear()

		store.dispatch({ type: 'UPDATE_EDITOR_STATE', data: editorStateFrom('<p data-search-key="a">No breaks.</p>') })
		expect(recorder.ofType('UPDATE_EDITOR_STATE')).toHaveLength(1)
	})
})

// Two defects, pinned as current behaviour. See plans/hygiene.md.
describe('editions a chapter has no pages in', () => {
	// Regression guard. A chapter with no page breaks in the chosen edition is
	// ordinary — not every chapter is paginated for every edition. paginate()
	// correctly returns an empty page list; joycePaginate used to store it anyway, and
	// paginationState's setStateWithPaginatedDoc reads edition.doc[0].blocks, throwing
	// from inside combineReducers.
	test('a chapter with no breaks for that edition is not paginated', () => {
		const { store, recorder } = setup()
		loadEditor(store, '<p data-search-key="a">A chapter with no page breaks at all.</p>')
		recorder.clear()

		expect(() => store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })).not.toThrow()
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(0)
	})

	test('nothing is stored for an edition the chapter has no pages in', () => {
		// readerContentContainer falls back to the unpaginated view when an edition
		// has no stored document, so the absence is what makes it degrade cleanly.
		const { store } = setup()
		loadEditor(store, '<p data-search-key="a">A chapter with no page breaks at all.</p>')
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })

		expect(store.getState().paginationState.documents[1922]).toBeUndefined()
	})

	test('the startup path is safe before a chapter has loaded', () => {
		// LOAD_PAGINATION fires on its own 100ms after any chapter loads, picks the
		// first edition, and paginates whatever editorState is current — including the
		// blank default, which has no pages in any edition. This was the wider of the
		// two routes into the crash.
		const { store } = setup()
		expect(() => store.dispatch({ type: 'LOAD_PAGINATION' })).not.toThrow()
		expect(store.getState().paginationState.documents).toEqual({})
	})

	test('a chapter that does have breaks is still paginated', () => {
		// The guard must not suppress the ordinary case.
		const { store, recorder } = setup()
		loadEditor(store)
		recorder.clear()
		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })

		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(1)
		expect(store.getState().paginationState.documents[1922].doc.length).toBeGreaterThan(0)
	})
})

// Known defect, pinned as current behaviour. See plans/hygiene.md item 7.
describe('the paginate-mode guard', () => {
	// The SET_PAGINATION_EDITION guard reads `mode !== 'PAGINATION_MODE'`, and its
	// comment says pagination should be skipped in the editor's paginate mode because
	// the result is not used there. But the mode is spelled PAGINATE_MODE everywhere
	// else in src/ — PAGINATION_MODE appears exactly once, here — so the guard is
	// always true and the work is done regardless.
	test('paginate mode does not suppress pagination, despite the guard', () => {
		const { store, recorder } = setup()
		loadEditor(store)
		store.dispatch({ type: 'SET_MODE', mode: 'PAGINATE_MODE' })
		recorder.clear()

		store.dispatch({ type: 'SET_PAGINATION_EDITION', data: EDITION })
		expect(recorder.ofType('ADD_PAGINATED_DOCUMENT')).toHaveLength(1)
	})
})
