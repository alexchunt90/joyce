import joyceRouter from '../../src/middleware/joyceRouter'
import modalControl from '../../src/modules/modalControl'

jest.mock('../../src/modules/modalControl', () => ({
	isAnnotationModalOpen: jest.fn(() => false),
	showAnnotationModal: jest.fn(),
	hideAnnotationModal: jest.fn(),
	consumeSelfInitiatedHide: jest.fn(() => false),
}))

const NOTE_A = 'AWNM3N3mxgFi4og697uA'
const NOTE_B = 'AWNM3N3mxgFi4og697uB'

// Minimal state: enough for joyceRouter's top-of-middleware reads plus the note logic
const baseState = {
	chapters: [{id: 'chapterid00000000001', number: 1}, {id: 'chapterid00000000004', number: 4}],
	notes: [], info: [], tags: [], media: [],
	editorState: {},
	currentDocument: {id: 'chapterid00000000004', number: 4},
	currentBlock: {},
	docType: 'chapters',
	annotationNote: {},
}

const setup = (stateOverrides = {}) => {
	const dispatched = []
	const store = {
		getState: () => ({...baseState, ...stateOverrides}),
		dispatch: action => { dispatched.push(action) },
	}
	const next = jest.fn()
	const invoke = action => joyceRouter(store)(next)(action)
	return { dispatched, next, invoke }
}

const pushedPaths = dispatched =>
	dispatched.filter(a => a.type === '@@router/CALL_HISTORY_METHOD').map(a => a.payload.args[0])

const locationChanged = () => ({type: '@@router/ON_LOCATION_CHANGED', payload: {location: window.location}})

beforeEach(() => {
	jest.clearAllMocks()
	modalControl.isAnnotationModalOpen.mockReturnValue(false)
	window.history.pushState({}, '', '/4')
})

describe('OPEN_ANNOTATION_NOTE', () => {
	test('pushes ?note=<id> onto the current path', () => {
		const { dispatched, invoke, next } = setup()
		invoke({type: 'OPEN_ANNOTATION_NOTE', id: NOTE_A})
		expect(pushedPaths(dispatched)).toEqual(['/4?note=' + NOTE_A])
		expect(next).toHaveBeenCalledTimes(1)
	})
	test('keeps the hash so search-result block jumps survive', () => {
		window.history.pushState({}, '', '/4#blockkey')
		const { dispatched, invoke } = setup()
		invoke({type: 'OPEN_ANNOTATION_NOTE', id: NOTE_A})
		expect(pushedPaths(dispatched)).toEqual(['/4?note=' + NOTE_A + '#blockkey'])
	})
	test('does not stack a history entry when the note is already in the URL', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { dispatched, invoke } = setup({annotationNote: {id: NOTE_A}})
		invoke({type: 'OPEN_ANNOTATION_NOTE', id: NOTE_A})
		expect(pushedPaths(dispatched)).toEqual([])
		// ...but it still makes sure the modal is showing (close, then re-click the same link)
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})
})

describe('ON_LOCATION_CHANGED', () => {
	test('a new note param loads the note and shows the modal (first click)', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { dispatched, invoke } = setup()
		invoke(locationChanged())
		expect(dispatched).toContainEqual({type: 'SELECT_ANNOTATION_NOTE', id: NOTE_A})
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})
	test('a different note param while open swaps the note without re-showing (chain / Back)', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_B)
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		const { dispatched, invoke } = setup({annotationNote: {id: NOTE_A}})
		invoke(locationChanged())
		expect(dispatched).toContainEqual({type: 'SELECT_ANNOTATION_NOTE', id: NOTE_B})
		expect(modalControl.showAnnotationModal).not.toHaveBeenCalled()
	})
	test('a param matching the loaded note does not refetch', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { dispatched, invoke } = setup({annotationNote: {id: NOTE_A}})
		invoke(locationChanged())
		expect(dispatched.filter(a => a.type === 'SELECT_ANNOTATION_NOTE')).toEqual([])
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})
	test('no param while the modal is open hides it and pushes nothing (Back off the first note)', () => {
		modalControl.isAnnotationModalOpen.mockReturnValue(true)
		const { dispatched, invoke } = setup({annotationNote: {id: NOTE_A}})
		invoke(locationChanged())
		expect(modalControl.hideAnnotationModal).toHaveBeenCalledTimes(1)
		expect(pushedPaths(dispatched)).toEqual([])
		expect(dispatched.filter(a => a.type === 'SELECT_ANNOTATION_NOTE')).toEqual([])
	})
	test('no param and modal closed is a no-op', () => {
		const { invoke } = setup()
		invoke(locationChanged())
		expect(modalControl.hideAnnotationModal).not.toHaveBeenCalled()
		expect(modalControl.showAnnotationModal).not.toHaveBeenCalled()
	})
	test('redirecting /:id to the current document carries the note param', () => {
		// With no chapter list yet, /:id falls through to a push of the current document's number
		window.history.pushState({}, '', '/:id?note=' + NOTE_A)
		const { dispatched, invoke } = setup({chapters: []})
		invoke(locationChanged())
		expect(pushedPaths(dispatched)).toEqual(['4?note=' + NOTE_A])
	})
})

describe('CLOSE_ANNOTATION_NOTE', () => {
	test('pushes the clean path when a note is in the URL', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A + '#blockkey')
		const { dispatched, invoke } = setup()
		invoke({type: 'CLOSE_ANNOTATION_NOTE'})
		expect(pushedPaths(dispatched)).toEqual(['/4#blockkey'])
	})
	test('pushes nothing when the URL is already clean', () => {
		const { dispatched, invoke } = setup()
		invoke({type: 'CLOSE_ANNOTATION_NOTE'})
		expect(pushedPaths(dispatched)).toEqual([])
	})
})

describe('GET_DOCUMENT_TEXT for the modal note', () => {
	test('shows the modal once the deep-linked note arrives (boot has no location change)', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { invoke } = setup()
		invoke({type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote', docType: 'notes', id: NOTE_A, data: {id: NOTE_A}})
		expect(modalControl.showAnnotationModal).toHaveBeenCalledTimes(1)
	})
	test('ignores a note that is no longer the one in the URL', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_B)
		const { invoke } = setup()
		invoke({type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote', docType: 'notes', id: NOTE_A, data: {id: NOTE_A}})
		expect(modalControl.showAnnotationModal).not.toHaveBeenCalled()
	})
	test('a failed deep link degrades to the plain document', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { dispatched, invoke } = setup()
		invoke({type: 'GET_DOCUMENT_TEXT', status: 'error', state: 'annotationNote', docType: 'notes', id: NOTE_A, data: {}})
		expect(modalControl.hideAnnotationModal).toHaveBeenCalledTimes(1)
		expect(pushedPaths(dispatched)).toEqual(['/4'])
	})
	test('resolving the /:id placeholder after the document loads carries the note param', () => {
		window.history.pushState({}, '', '/:id?note=' + NOTE_A)
		const { dispatched, invoke } = setup()
		invoke({type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument', docType: 'chapters', id: 'chapterid00000000001', data: {id: 'chapterid00000000001', number: 1}})
		expect(pushedPaths(dispatched)).toEqual(['1?note=' + NOTE_A])
	})
	test('a genuine chapter change drops the note param', () => {
		window.history.pushState({}, '', '/4?note=' + NOTE_A)
		const { dispatched, invoke } = setup()
		invoke({type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument', docType: 'chapters', id: 'chapterid00000000001', data: {id: 'chapterid00000000001', number: 1}})
		expect(pushedPaths(dispatched)).toEqual(['1'])
	})
})
