// The annotation modal's note id lives in the URL (?note=<id>) so a refresh reopens the
// note and Back walks a chain of notes. The store here is real — root reducer, router
// middleware, joyceRouter — so these exercise the reducers' part of the contract too
// (annotationNote only holds a note after its text arrives, which is what the
// "already loaded, do not refetch" guard reads). Only the Bootstrap layer is mocked.

import joyceRouter from '../../src/middleware/joyceRouter'
import modalControl from '../../src/modules/modalControl'
import actions from '../../src/actions'
import { buildStore, createRecorder, seedDocumentLists, NOTES } from '../helpers/store'

jest.mock('../../src/modules/modalControl', () => ({
	isAnnotationModalOpen: jest.fn(() => false),
	showAnnotationModal: jest.fn(),
	hideAnnotationModal: jest.fn(),
	consumeSelfInitiatedHide: jest.fn(() => false),
}))

const NOTE_A = NOTES[0].id
const NOTE_B = NOTES[1].id

const setup = (path = '/4') => {
	const recorder = createRecorder()
	const harness = buildStore([joyceRouter], { path, observer: recorder.middleware })
	seedDocumentLists(harness.store)
	recorder.clear()
	return { ...harness, recorder }
}

const noteLoads = recorder => recorder.ofType('SELECT_ANNOTATION_NOTE').map(a => a.id)

// createRouterMiddleware applies push() in a microtask, so anything that pushes has to
// be awaited before the URL (and the ON_LOCATION_CHANGED it triggers) can be observed.
const flush = () => new Promise(resolve => setTimeout(resolve, 0))
const currentURL = () => window.location.pathname + window.location.search

const open = async (store, id) => {
	store.dispatch(actions.openAnnotationNote(id))
	await flush()
}

// Play the API response for a modal note, the way joyceAPI would
const noteArrives = (store, id) =>
	store.dispatch(actions.getDocumentText({
		id, docType: 'notes', status: 'success', state: 'annotationNote',
		data: { id, title: 'A note', html_source: '<p>text</p>', media_doc_ids: [] },
	}))

beforeEach(() => {
	jest.clearAllMocks()
	modalControl.isAnnotationModalOpen.mockReturnValue(false)
})

describe('clicking a note link', () => {
	test('puts the note id in the URL and loads it from there', async () => {
		const { store, recorder } = setup('/4')
		await open(store, NOTE_A)
		expect(currentURL()).toBe('/4?note=' + NOTE_A)
		expect(noteLoads(recorder)).toEqual([NOTE_A])
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})

	test('a link inside the modal adds a second history entry rather than replacing the first', async () => {
		const { store, recorder } = setup('/4')
		await open(store, NOTE_A)
		// the first click showed the modal, so by the time the note arrives it is open
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		noteArrives(store, NOTE_A)
		await open(store, NOTE_B)
		expect(window.location.search).toBe('?note=' + NOTE_B)
		expect(noteLoads(recorder)).toEqual([NOTE_A, NOTE_B])
		// the modal was already open, so it was shown once, for the first note
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})

	test('re-clicking the note already open does not add a history entry or refetch', async () => {
		const { store, recorder } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		recorder.clear()
		await open(store, NOTE_A)
		expect(recorder.ofType('@@router/CALL_HISTORY_METHOD')).toEqual([])
		expect(noteLoads(recorder)).toEqual([])
	})
})

describe('walking back through a chain', () => {
	test('Back from the second note reloads the first', async () => {
		const { store, navigate, recorder } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		await open(store, NOTE_B)
		noteArrives(store, NOTE_B)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		recorder.clear()
		// history.back() is asynchronous in jsdom; navigating to the previous entry's URL
		// produces the same ON_LOCATION_CHANGED joyceRouter would see
		navigate('/4?note=' + NOTE_A)
		expect(noteLoads(recorder)).toEqual([NOTE_A])
		expect(modalControl.hideAnnotationModal).not.toHaveBeenCalled()
	})

	test('Back off the first note closes the modal without pushing anything', async () => {
		const { store, navigate, recorder } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		recorder.clear()
		navigate('/4')
		expect(modalControl.hideAnnotationModal).toHaveBeenCalledTimes(1)
		expect(recorder.ofType('@@router/CALL_HISTORY_METHOD')).toEqual([])
		expect(noteLoads(recorder)).toEqual([])
	})

	test('Forward onto a note that is still loaded shows the modal without refetching', async () => {
		const { store, navigate, recorder } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		navigate('/4')
		recorder.clear()
		jest.clearAllMocks()
		navigate('/4?note=' + NOTE_A)
		expect(noteLoads(recorder)).toEqual([])
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})
})

describe('closing the modal', () => {
	test('drops the note from the URL as a new history entry', async () => {
		const { store, recorder } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		recorder.clear()
		store.dispatch(actions.closeAnnotationNote())
		await flush()
		expect(currentURL()).toBe('/4')
		expect(recorder.ofType('@@router/CALL_HISTORY_METHOD').map(a => a.payload.method)).toEqual(['push'])
	})

	test('switching chapter while a note is open drops the note from the URL', async () => {
		const { store, navigate } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		// the sidebar sets a new current document; once its text arrives joyceRouter
		// redirects to its number, and that relative push carries no query string
		store.dispatch(actions.getDocumentText({
			id: 'chapterAAAAAAAAAA001', docType: 'chapters', status: 'success', state: 'currentDocument',
			data: { id: 'chapterAAAAAAAAAA001', number: 1, html_source: '<p>x</p>' },
		}))
		await flush()
		expect(currentURL()).toBe('/1')
		expect(modalControl.hideAnnotationModal).toHaveBeenCalledTimes(1)
	})
})

describe('deep links', () => {
	test('a note param on a placeholder path survives the redirect', async () => {
		const { store, recorder } = setup('/:id?note=' + NOTE_A)
		store.dispatch(actions.getDocumentText({
			id: 'chapterAAAAAAAAAA001', docType: 'chapters', status: 'success', state: 'currentDocument',
			data: { id: 'chapterAAAAAAAAAA001', number: 1, html_source: '<p>x</p>' },
		}))
		await flush()
		expect(currentURL()).toBe('/1?note=' + NOTE_A)
		expect(noteLoads(recorder)).toEqual([NOTE_A])
	})

	test('the note arriving shows the modal even though no location change fired at boot', async () => {
		const { store } = setup('/4?note=' + NOTE_A)
		noteArrives(store, NOTE_A)
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
		expect(store.getState().annotationNote.id).toBe(NOTE_A)
	})

	test('a note that fails to load is dropped from the URL', async () => {
		const { store } = setup('/4?note=' + NOTE_A)
		store.dispatch(actions.getDocumentText({
			id: NOTE_A, docType: 'notes', status: 'error', state: 'annotationNote', data: {},
		}))
		await flush()
		expect(currentURL()).toBe('/4')
		expect(modalControl.showAnnotationModal).not.toHaveBeenCalled()
	})
})

describe('modal media', () => {
	const mediaArrives = store =>
		store.dispatch(actions.getMediaDocs({ media_doc_ids: ['m1'], modal_note: true, status: 'success', data: [{ id: 'm1' }] }))

	test('requesting a new modal note clears the previous note\'s media immediately', () => {
		const { store } = setup('/4')
		mediaArrives(store)
		expect(store.getState().annotationNoteMedia).toHaveLength(1)
		store.dispatch(actions.getDocumentText({ id: NOTE_B, docType: 'notes', state: 'annotationNote' }))
		expect(store.getState().annotationNoteMedia).toEqual([])
	})

	// Regression: on a refresh of /4?note=<id> the note's media arrived before the chapter
	// list selected the chapter, and SET_CURRENT_DOCUMENT wiped it, so the images never showed
	test('a deep-linked note keeps its media when the chapter is selected afterwards', () => {
		const { store } = setup('/4?note=' + NOTE_A)
		noteArrives(store, NOTE_A)
		mediaArrives(store)
		store.dispatch(actions.setCurrentDocument('chapterAAAAAAAAAA004', 'chapters'))
		expect(store.getState().annotationNoteMedia).toHaveLength(1)
	})

	test('closing the modal clears the media', async () => {
		const { store } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		mediaArrives(store)
		store.dispatch(actions.closeAnnotationNote())
		await flush()
		expect(store.getState().annotationNoteMedia).toEqual([])
	})

	test('the router closing the modal on Back clears the media too', async () => {
		const { store, navigate } = setup('/4')
		await open(store, NOTE_A)
		noteArrives(store, NOTE_A)
		mediaArrives(store)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		navigate('/4')
		expect(store.getState().annotationNoteMedia).toEqual([])
	})
})
