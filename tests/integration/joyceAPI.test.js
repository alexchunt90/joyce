// joyceAPI is the seam between the store and the network: it turns 'request' actions
// into HTTP calls and feeds the responses back in as actions. These tests mock
// src/modules/api entirely, so nothing here touches a server — what is being checked
// is that each action reaches the right api function with the right arguments, and
// that the response is dispatched back into the store.

import joyceAPI from '../../src/middleware/joyceAPI'
import api from '../../src/modules/api'
import { buildStore, createRecorder, CHAPTERS, NOTES } from '../helpers/store'

jest.mock('../../src/modules/api', () => ({
	__esModule: true,
	default: {
		HTTPGetDocumentList: jest.fn(),
		HTTPGetDocumentText: jest.fn(),
		HTTPPostRetrieveDocuments: jest.fn(),
		HTTPDeleteDocument: jest.fn(),
		HTTPPutCreateDocument: jest.fn(),
		HTTPPostWriteDocument: jest.fn(),
		HTTPPostCreateMediaDocument: jest.fn(),
		HTTPPostWriteMediaDocument: jest.fn(),
		HTTPPostSearchResults: jest.fn(),
	},
}))

const setup = () => {
	const recorder = createRecorder()
	const harness = buildStore([joyceAPI], { observer: recorder.middleware })
	recorder.clear()
	return { ...harness, recorder }
}

// Let the mocked promise resolve and its dispatch land.
const flush = () => new Promise(resolve => setImmediate(resolve))

beforeEach(() => {
	jest.clearAllMocks()
	for (const fn of Object.values(api)) fn.mockResolvedValue({ status: 'success', data: [] })
})

describe('fetching', () => {
	test('a list request calls the list endpoint for that docType', async () => {
		const { store } = setup()
		store.dispatch({ type: 'GET_DOCUMENT_LIST', status: 'request', docType: 'notes' })
		expect(api.HTTPGetDocumentList).toHaveBeenCalledWith('notes')
	})

	test('the list response is dispatched back into the store', async () => {
		api.HTTPGetDocumentList.mockResolvedValue({
			status: 'success', docType: 'chapters', data: CHAPTERS,
		})
		const { store } = setup()
		store.dispatch({ type: 'GET_DOCUMENT_LIST', status: 'request', docType: 'chapters' })
		await flush()
		expect(store.getState().chapters).toEqual(CHAPTERS)
	})

	test('a document text request passes id, docType and state through', () => {
		const { store } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'request',
			id: 'noteAAAAAAAAAAAAAA01', docType: 'notes', state: 'currentDocument',
		})
		expect(api.HTTPGetDocumentText)
			.toHaveBeenCalledWith('noteAAAAAAAAAAAAAA01', 'notes', 'currentDocument')
	})

	test('the document text response becomes the current document', async () => {
		const doc = { id: 'noteAAAAAAAAAAAAAA01', title: 'Buck Mulligan' }
		api.HTTPGetDocumentText.mockResolvedValue({
			id: doc.id, status: 'success', docType: 'notes', state: 'currentDocument', data: doc,
		})
		const { store } = setup()
		store.dispatch({
			type: 'GET_DOCUMENT_TEXT', status: 'request',
			id: doc.id, docType: 'notes', state: 'currentDocument',
		})
		await flush()
		expect(store.getState().currentDocument).toEqual(doc)
	})

	test('a media docs request forwards the id list and the modal flag', () => {
		const { store } = setup()
		store.dispatch({
			type: 'GET_MEDIA_DOCS', status: 'request',
			media_doc_ids: ['mediaAAAAAAAAAAAAA01'], docType: 'media', modalNote: true,
		})
		expect(api.HTTPPostRetrieveDocuments)
			.toHaveBeenCalledWith(['mediaAAAAAAAAAAAAA01'], 'media', true)
	})

	test('a search request forwards the search payload', () => {
		const { store } = setup()
		const data = { searchInput: 'stately', docTypes: { chapters: true }, resultCount: 5 }
		store.dispatch({ type: 'GET_SEARCH_RESULTS', status: 'request', data })
		expect(api.HTTPPostSearchResults).toHaveBeenCalledWith(data)
	})
})

describe('saving', () => {
	test('a document with an id is written, not created', () => {
		const { store } = setup()
		const data = { title: 'Telemachus', html_source: '<p>x</p>' }
		store.dispatch({
			type: 'SAVE_DOCUMENT', status: 'request',
			id: 'chapterAAAAAAAAAA001', docType: 'chapters', data,
		})
		expect(api.HTTPPostWriteDocument)
			.toHaveBeenCalledWith('chapterAAAAAAAAAA001', 'chapters', data)
		expect(api.HTTPPutCreateDocument).not.toHaveBeenCalled()
	})

	test('a document with no id is created, not written', () => {
		const { store } = setup()
		const data = { title: 'New note' }
		store.dispatch({ type: 'SAVE_DOCUMENT', status: 'request', id: null, docType: 'notes', data })
		expect(api.HTTPPutCreateDocument).toHaveBeenCalledWith('notes', data)
		expect(api.HTTPPostWriteDocument).not.toHaveBeenCalled()
	})

	test('the save response replaces the document list', async () => {
		api.HTTPPutCreateDocument.mockResolvedValue({
			status: 'success', docType: 'notes', data: NOTES,
		})
		const { store } = setup()
		store.dispatch({
			type: 'SAVE_DOCUMENT', status: 'request', id: null, docType: 'notes', data: {},
		})
		await flush()
		expect(store.getState().notes).toEqual(NOTES)
	})
})

describe('saving media', () => {
	// Flask expects multipart form data for uploads, so this branch builds FormData
	// rather than posting JSON.
	const mediaAction = (overrides = {}) => ({
		type: 'SAVE_DOCUMENT', status: 'request', id: null, docType: 'media',
		data: {
			title: 'Martello Tower',
			html_source: '<p>caption</p>',
			search_text: [{ key: 'a', text: 'caption' }],
			...overrides,
		},
	})

	test('an upload is sent as multipart form data', () => {
		const { store } = setup()
		const file = new File(['bytes'], 'tower.jpg', { type: 'image/jpeg' })
		store.dispatch(mediaAction({ uploadFile: [file] }))

		const [docType, form, headers] = api.HTTPPostCreateMediaDocument.mock.calls[0]
		expect(docType).toBe('media')
		expect(form).toBeInstanceOf(FormData)
		expect(headers.headers['Content-Type']).toBe('multipart/form-data')
	})

	test('the form carries the file, title and serialised search text', () => {
		const { store } = setup()
		const file = new File(['bytes'], 'tower.jpg', { type: 'image/jpeg' })
		store.dispatch(mediaAction({ uploadFile: [file] }))

		const form = api.HTTPPostCreateMediaDocument.mock.calls[0][1]
		expect(form.get('uploadFile')).toBe(file)
		expect(form.get('title')).toBe('Martello Tower')
		expect(JSON.parse(form.get('search_text'))).toEqual([{ key: 'a', text: 'caption' }])
	})

	test('a YouTube URL is sent instead of a file', () => {
		const { store } = setup()
		store.dispatch(mediaAction({ youtubeURL: 'https://youtu.be/abc' }))

		const form = api.HTTPPostCreateMediaDocument.mock.calls[0][1]
		expect(form.get('youtube_url')).toBe('https://youtu.be/abc')
		expect(form.get('uploadFile')).toBeNull()
	})

	test('an existing media document is written, not created', () => {
		const { store } = setup()
		store.dispatch({ ...mediaAction({ youtubeURL: 'https://youtu.be/abc' }), id: 'mediaAAAAAAAAAAAAA01' })
		expect(api.HTTPPostWriteMediaDocument).toHaveBeenCalled()
		expect(api.HTTPPostCreateMediaDocument).not.toHaveBeenCalled()
	})
})

describe('deleting', () => {
	test('a delete request calls the delete endpoint', () => {
		const { store } = setup()
		store.dispatch({
			type: 'DELETE_DOCUMENT', status: 'request', id: 'noteAAAAAAAAAAAAAA01', docType: 'notes',
		})
		expect(api.HTTPDeleteDocument).toHaveBeenCalledWith('noteAAAAAAAAAAAAAA01', 'notes')
	})

	test('the delete response replaces the document list', async () => {
		api.HTTPDeleteDocument.mockResolvedValue({
			id: 'gone', status: 'success', docType: 'notes', data: NOTES,
		})
		const { store } = setup()
		store.dispatch({ type: 'DELETE_DOCUMENT', status: 'request', id: 'gone', docType: 'notes' })
		await flush()
		expect(store.getState().notes).toEqual(NOTES)
	})
})

describe('actions that should not reach the network', () => {
	test.each([
		['GET_DOCUMENT_LIST'], ['GET_DOCUMENT_TEXT'], ['SAVE_DOCUMENT'], ['DELETE_DOCUMENT'],
	])('%s with a success status makes no call', type => {
		const { store } = setup()
		store.dispatch({ type, status: 'success', docType: 'notes', data: [] })
		for (const fn of Object.values(api)) expect(fn).not.toHaveBeenCalled()
	})
})
