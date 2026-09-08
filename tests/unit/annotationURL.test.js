import annotationURL from '../../src/modules/annotationURL'

const ID = 'AWNM3N3mxgFi4og697un'

describe('parseNoteParam', () => {
	test('returns the note id when present', () => {
		expect(annotationURL.parseNoteParam('?note=' + ID)).toBe(ID)
	})
	test('returns undefined when absent or empty', () => {
		expect(annotationURL.parseNoteParam('')).toBeUndefined()
		expect(annotationURL.parseNoteParam('?other=1')).toBeUndefined()
		expect(annotationURL.parseNoteParam('?note=')).toBeUndefined()
	})
	test('defaults to window.location.search', () => {
		window.history.pushState({}, '', '/4?note=' + ID)
		expect(annotationURL.parseNoteParam()).toBe(ID)
		window.history.pushState({}, '', '/4')
		expect(annotationURL.parseNoteParam()).toBeUndefined()
	})
})

describe('pathWithNote', () => {
	test('appends the param to a bare path', () => {
		expect(annotationURL.pathWithNote(ID, '/4', '', '')).toBe('/4?note=' + ID)
	})
	test('preserves the hash and other params, replacing an existing note', () => {
		expect(annotationURL.pathWithNote('newid', '/4', '?a=1&note=old', '#block')).toBe('/4?a=1&note=newid#block')
	})
})

describe('pathWithoutNote', () => {
	test('removes only the note param and keeps the hash', () => {
		expect(annotationURL.pathWithoutNote('/4', '?note=' + ID, '#block')).toBe('/4#block')
		expect(annotationURL.pathWithoutNote('/4', '?a=1&note=' + ID, '')).toBe('/4?a=1')
	})
	test('is a no-op without a note param', () => {
		expect(annotationURL.pathWithoutNote('/4', '', '')).toBe('/4')
	})
})

describe('carryNoteParam', () => {
	test('re-attaches the current note to a redirect path', () => {
		expect(annotationURL.carryNoteParam('1', '?note=' + ID)).toBe('1?note=' + ID)
	})
	test('leaves the path alone when there is no note or it already has a query', () => {
		expect(annotationURL.carryNoteParam('1', '')).toBe('1')
		expect(annotationURL.carryNoteParam('1?x=y', '?note=' + ID)).toBe('1?x=y')
	})
})
