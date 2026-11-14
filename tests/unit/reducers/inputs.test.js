// inputs holds the editor's pending form values. The media upload file and
// YouTube URL must not outlive the media document they were entered for:
// a leftover file was submitted with later edits to other images and
// overwrote them on disk (e.g. LadiesGossiping replacing FollowMe).

import inputs from '../../../src/reducers/inputs'

const FILE = [{ name: 'LadiesGossiping.jpg', type: 'image/jpeg' }]
const initial = () => inputs(undefined, { type: '@@INIT' })
const withPending = (overrides = {}) => ({ ...initial(), uploadFile: FILE, externalURL: '', ...overrides })

const loadMedia = (data, extra = {}) => ({
	type: 'GET_DOCUMENT_TEXT', status: 'success', docType: 'media',
	state: 'currentDocument', data, ...extra,
})

describe('inputs: media upload file', () => {
	test('choosing a file stores it', () => {
		expect(inputs(initial(), { type: 'UPDATE_MEDIA_INPUT', data: FILE }).uploadFile).toBe(FILE)
	})

	test('a successful media save clears the file', () => {
		const result = inputs(withPending(), { type: 'SAVE_DOCUMENT', status: 'success', docType: 'media', id: 'a' })
		expect(result.uploadFile).toBeUndefined()
	})

	test('a successful media create clears the file', () => {
		const result = inputs(withPending(), { type: 'SAVE_DOCUMENT', status: 'success', docType: 'media', id: null })
		expect(result.uploadFile).toBeUndefined()
	})

	test('a failed media save keeps the file so the editor can retry', () => {
		const result = inputs(withPending(), { type: 'SAVE_DOCUMENT', status: 'error', docType: 'media', id: 'a' })
		expect(result.uploadFile).toBe(FILE)
	})

	test('a pending save request does not clear the file', () => {
		const result = inputs(withPending(), { type: 'SAVE_DOCUMENT', status: 'request', docType: 'media', id: 'a' })
		expect(result.uploadFile).toBe(FILE)
	})

	test('loading another image clears a file chosen but never submitted', () => {
		const result = inputs(withPending(), loadMedia({ id: 'b', title: 'FollowMe', type: 'img' }))
		expect(result.uploadFile).toBeUndefined()
		expect(result.documentTitle).toBe('FollowMe')
	})

	test('the full sequence: upload to one image, then edit another', () => {
		let state = inputs(initial(), { type: 'UPDATE_MEDIA_INPUT', data: FILE })
		state = inputs(state, { type: 'SAVE_DOCUMENT', status: 'success', docType: 'media', id: 'ladies' })
		state = inputs(state, loadMedia({ id: 'ladies', title: 'LadiesGossiping', type: 'img' }))
		state = inputs(state, loadMedia({ id: 'followme', title: 'FollowMe', type: 'img' }))
		expect(state.uploadFile).toBeUndefined()
	})

	test('loading a modal or annotation media request leaves editor inputs alone', () => {
		const result = inputs(withPending(), loadMedia({ id: 'b', title: 'Other', type: 'img' }, { state: 'annotationNote' }))
		expect(result.uploadFile).toBe(FILE)
	})
})

describe('inputs: media YouTube URL', () => {
	const URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

	test('loading a YouTube item fills in its URL', () => {
		const result = inputs(initial(), loadMedia({ id: 'v', title: 'Video', type: 'yt', youtube_url: URL }))
		expect(result.externalURL).toBe(URL)
	})

	test('loading an image after a YouTube item clears the previous URL', () => {
		let state = inputs(initial(), loadMedia({ id: 'v', title: 'Video', type: 'yt', youtube_url: URL }))
		state = inputs(state, loadMedia({ id: 'i', title: 'Image', type: 'img' }))
		expect(state.externalURL).toBe('')
	})

	test('a successful media save clears the URL', () => {
		const result = inputs(withPending({ uploadFile: undefined, externalURL: URL }),
			{ type: 'SAVE_DOCUMENT', status: 'success', docType: 'media', id: 'v' })
		expect(result.externalURL).toBe('')
	})
})

describe('inputs: tag saves', () => {
	test('a successful tag save still clears the colour picker', () => {
		const result = inputs({ ...initial(), colorPicker: 'FF0000' },
			{ type: 'SAVE_DOCUMENT', status: 'success', docType: 'tags', id: 't' })
		expect(result.colorPicker).toBe('')
	})

	test('saves of other document types leave a pending media file alone', () => {
		const result = inputs(withPending(), { type: 'SAVE_DOCUMENT', status: 'success', docType: 'notes', id: 'n' })
		expect(result.uploadFile).toBe(FILE)
	})
})
