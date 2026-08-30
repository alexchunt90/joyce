// joyceRouter is the busiest piece of cross-cutting logic in the app: one switch,
// eight cases, every branch reading location.pathname and dispatching into the store.
// CLAUDE.md points at it as the place to start understanding routing, and 146a015
// ("Fixing currentDoc overwritten when switching to edit mode") is exactly the kind
// of regression these tests exist to catch.
//
// The store is real — the actual root reducer, the actual router middleware — so
// these are integration tests across joyceRouter and the reducers. Assertions are on
// the actions joyceRouter dispatches, because turning SET_CURRENT_DOCUMENT into a
// loaded document is joyceInterface's job, not this middleware's.

import joyceRouter from '../../src/middleware/joyceRouter'
import {
	buildStore, createRecorder, seedDocumentLists,
	CHAPTERS, NOTES, INFO, TAGS, MEDIA,
} from '../helpers/store'

const setup = (path = '/', { seed = true } = {}) => {
	const recorder = createRecorder()
	const harness = buildStore([joyceRouter], { path, observer: recorder.middleware })
	if (seed) seedDocumentLists(harness.store)
	recorder.clear()
	return { ...harness, recorder }
}

const selections = recorder =>
	recorder.ofType('SET_CURRENT_DOCUMENT').map(a => [a.id, a.docType])
const pushedPaths = recorder =>
	recorder.ofType('@@router/CALL_HISTORY_METHOD').map(a => a.payload?.args?.[0])

describe('selecting a document from the path', () => {
	test('a chapter number selects the chapter with that number', () => {
		const { navigate, recorder } = setup('/')
		navigate('/4')
		expect(selections(recorder)).toContainEqual(['chapterAAAAAAAAAA004', 'chapters'])
	})

	test('a chapter number also switches docType back to chapters', () => {
		const { store, navigate } = setup('/notes/noteAAAAAAAAAAAAAA01')
		expect(store.getState().docType).toBe('notes')
		navigate('/4')
		expect(store.getState().docType).toBe('chapters')
	})

	test('a note id selects that note', () => {
		const { navigate, recorder, store } = setup('/')
		navigate('/notes/noteAAAAAAAAAAAAAA02')
		expect(store.getState().docType).toBe('notes')
		expect(selections(recorder)).toContainEqual(['noteAAAAAAAAAAAAAA02', 'notes'])
	})

	test('an info id selects that info page', () => {
		const { navigate, recorder, store } = setup('/')
		navigate('/info/infoAAAAAAAAAAAAAA03')
		expect(store.getState().docType).toBe('info')
		expect(selections(recorder)).toContainEqual(['infoAAAAAAAAAAAAAA03', 'info'])
	})

	test('a number that matches no chapter selects nothing', () => {
		const { navigate, recorder } = setup('/')
		navigate('/99')
		expect(selections(recorder)).toEqual([])
	})
})

describe('the :id redirect placeholder', () => {
	test('/:id selects the first chapter', () => {
		const { navigate, recorder } = setup('/')
		navigate('/:id')
		expect(selections(recorder)).toContainEqual([CHAPTERS[0].id, 'chapters'])
	})

	test('/notes/:id selects the first note', () => {
		const { navigate, recorder } = setup('/')
		navigate('/notes/:id')
		expect(selections(recorder)).toContainEqual([NOTES[0].id, 'notes'])
	})

	// Regression guard: this branch checked info.length but then selected media[0]
	// with docType 'media', copy-pasted from the media branch below it.
	test('/info/:id selects the first info page, not the first media document', () => {
		const { navigate, recorder } = setup('/')
		navigate('/info/:id')
		expect(selections(recorder)).toContainEqual([INFO[0].id, 'info'])
		expect(selections(recorder)).not.toContainEqual([MEDIA[0].id, 'media'])
	})

	test('/tags/:id selects the first tag', () => {
		const { navigate, recorder } = setup('/')
		navigate('/tags/:id')
		expect(selections(recorder)).toContainEqual([TAGS[0].id, 'tags'])
	})

	test('/media/:id selects the first media document', () => {
		const { navigate, recorder } = setup('/')
		navigate('/media/:id')
		expect(selections(recorder)).toContainEqual([MEDIA[0].id, 'media'])
	})

	test('selects nothing when the lists have not loaded yet', () => {
		const { navigate, recorder } = setup('/', { seed: false })
		navigate('/notes/:id')
		expect(selections(recorder)).toEqual([])
	})
})

describe('info pages reached through note paths', () => {
	// Resolved by matching the info page *title* against src/config.js
	// infoPageTitleConstants, not by id.
	test.each([
		['/notes/tally', 'Tally of Notes'],
		['/notes/index', 'Index of Titles'],
		['/notes/about', 'Methods'],
		['/notes/color', 'Colors'],
		['/notes/sources', 'Sources'],
		['/notes/contributors', 'Contributors'],
		['/notes/news', 'Latest News'],
	])('%s resolves to the info page titled "%s"', (path, title) => {
		const { navigate, recorder } = setup('/')
		navigate(path)
		const expected = INFO.find(i => i.title === title)
		expect(selections(recorder)).toContainEqual([expected.id, 'info'])
	})
})

describe('entering the editor', () => {
	// Guards 146a015: switching to edit mode used to lose the current document.
	test('/edit while viewing notes redirects into the notes editor', () => {
		const { store, navigate, recorder } = setup('/notes/noteAAAAAAAAAAAAAA01')
		expect(store.getState().docType).toBe('notes')
		recorder.clear()
		navigate('/edit')
		expect(pushedPaths(recorder).some(p => typeof p === 'string' && p.startsWith('/edit/notes')))
			.toBe(true)
	})

	test('/edit while viewing chapters does not redirect', () => {
		const { navigate, recorder } = setup('/4')
		recorder.clear()
		navigate('/edit')
		expect(pushedPaths(recorder)).toEqual([])
	})

	test('/edit/:id selects the first chapter', () => {
		const { navigate, recorder } = setup('/')
		navigate('/edit/:id')
		expect(selections(recorder)).toContainEqual([CHAPTERS[0].id, 'chapters'])
	})

	test('SET_EDITOR_DOC_TYPE pushes the editor path for that docType', () => {
		const { store, navigate, recorder } = setup('/')
		navigate('/edit')
		recorder.clear()
		store.dispatch({ type: 'SET_EDITOR_DOC_TYPE', docType: 'media' })
		expect(pushedPaths(recorder)).toContain('/edit/media')
	})

	test('SET_EDITOR_DOC_TYPE back to chapters pushes the bare editor path', () => {
		const { store, navigate, recorder } = setup('/')
		navigate('/edit/notes')
		recorder.clear()
		store.dispatch({ type: 'SET_EDITOR_DOC_TYPE', docType: 'chapters' })
		expect(pushedPaths(recorder)).toContain('/edit')
	})
})

describe('after a list arrives', () => {
	test('a chapter number in the path selects the matching chapter', () => {
		const { store, recorder } = setup('/4', { seed: false })
		store.dispatch({
			type: 'GET_DOCUMENT_LIST', docType: 'chapters', status: 'success', data: CHAPTERS,
		})
		expect(selections(recorder)).toContainEqual(['chapterAAAAAAAAAA004', 'chapters'])
	})

	test('an id in the path is selected once its list arrives', () => {
		const { store, recorder } = setup('/notes/noteAAAAAAAAAAAAAA02', { seed: false })
		store.dispatch({ type: 'SET_DOC_TYPE', docType: 'notes' })
		recorder.clear()
		store.dispatch({
			type: 'GET_DOCUMENT_LIST', docType: 'notes', status: 'success', data: NOTES,
		})
		expect(selections(recorder)).toContainEqual(['noteAAAAAAAAAAAAAA02', 'notes'])
	})
})

describe('after saving and deleting', () => {
	test('saving a new document selects the most recently created one', () => {
		const { store, recorder } = setup('/edit')
		recorder.clear()
		store.dispatch({
			type: 'SAVE_DOCUMENT', status: 'success', id: null, docType: 'notes',
			data: [
				{ id: 'older', created_at: 100 },
				{ id: 'newest', created_at: 999 },
				{ id: 'middle', created_at: 500 },
			],
		})
		expect(selections(recorder)).toContainEqual(['newest', 'notes'])
	})

	test('saving an existing document reloads the document already current', () => {
		const { store, navigate, recorder } = setup('/')
		navigate('/notes/noteAAAAAAAAAAAAAA01')
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
			docType: 'notes', data: { id: 'noteAAAAAAAAAAAAAA01', title: 'Buck Mulligan' },
		})
		recorder.clear()
		store.dispatch({
			type: 'SAVE_DOCUMENT', status: 'success', id: 'noteAAAAAAAAAAAAAA01',
			docType: 'notes', data: NOTES,
		})
		expect(selections(recorder)).toContainEqual(['noteAAAAAAAAAAAAAA01', 'notes'])
	})

	test('deleting selects the first remaining document', () => {
		const { store, recorder } = setup('/edit/notes')
		recorder.clear()
		store.dispatch({
			type: 'DELETE_DOCUMENT', status: 'success', docType: 'notes',
			data: [{ id: 'survivor-1' }, { id: 'survivor-2' }],
		})
		expect(selections(recorder)).toContainEqual(['survivor-1', 'notes'])
	})

	test('deleting the last document selects nothing', () => {
		const { store, recorder } = setup('/edit/notes')
		recorder.clear()
		store.dispatch({
			type: 'DELETE_DOCUMENT', status: 'success', docType: 'notes', data: [],
		})
		expect(selections(recorder)).toEqual([])
	})
})
