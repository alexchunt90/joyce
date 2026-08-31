// Editor-side submission validation. These run before anything is sent to the API,
// so a gap here shows up as a confusing 4xx or a silently malformed document.

import { validateSubmittedDocument, validateSubmittedAnnotation } from '../../src/modules/validation'

const LOGGED_IN = { isLoggedIn: true }
const LOGGED_OUT = { isLoggedIn: false }

// validateSubmittedDocument always reads inputs.documentTitle, so every case needs it.
const inputs = (overrides = {}) => ({ documentTitle: 'Telemachus', ...overrides })

describe('validateSubmittedDocument — authentication', () => {
	test('requires a logged-in user', () => {
		const errors = validateSubmittedDocument('chapters', inputs(), {}, LOGGED_OUT)
		expect(errors).toContain('You must log in to make edits.')
	})

	test('a valid chapter from a logged-in editor produces no errors', () => {
		expect(validateSubmittedDocument('chapters', inputs(), {}, LOGGED_IN)).toEqual([])
	})
})

describe('validateSubmittedDocument — title', () => {
	test('requires a non-empty title for every docType', () => {
		const errors = validateSubmittedDocument('chapters', inputs({ documentTitle: '' }), {}, LOGGED_IN)
		expect(errors).toContain('Please enter a title.')
	})

	test('accumulates multiple errors rather than stopping at the first', () => {
		const errors = validateSubmittedDocument('chapters', inputs({ documentTitle: '' }), {}, LOGGED_OUT)
		expect(errors).toEqual([
			'You must log in to make edits.',
			'Please enter a title.',
		])
	})
})

describe('validateSubmittedDocument — tags', () => {
	test('requires a colour to be chosen', () => {
		const errors = validateSubmittedDocument('tags', inputs({ colorPicker: '' }), {}, LOGGED_IN)
		expect(errors).toContain('Please select a tag color.')
	})

	test('requires the colour to be a valid hex value', () => {
		const errors = validateSubmittedDocument('tags', inputs({ colorPicker: 'ZZTOP!' }), {}, LOGGED_IN)
		expect(errors).toContain('Please select a valid hex code color.')
	})

	test('accepts a valid uppercase hex colour', () => {
		expect(validateSubmittedDocument('tags', inputs({ colorPicker: 'FF0000' }), {}, LOGGED_IN)).toEqual([])
	})

	// Consequence of the missing `i` flag in regex.HEX_COLOR — see regex.test.js.
	test('rejects a lowercase hex colour (known defect)', () => {
		const errors = validateSubmittedDocument('tags', inputs({ colorPicker: 'ff0000' }), {}, LOGGED_IN)
		expect(errors).toContain('Please select a valid hex code color.')
	})
})

describe('validateSubmittedDocument — editions', () => {
	test('requires a year', () => {
		const errors = validateSubmittedDocument('editions', inputs({ editionYear: '' }), {}, LOGGED_IN)
		expect(errors).toContain('Please enter the edition year.')
	})

	test('accepts a valid year', () => {
		expect(validateSubmittedDocument('editions', inputs({ editionYear: '1922' }), {}, LOGGED_IN)).toEqual([])
	})

	// Guards a previously-fixed defect: this read `parseInt(year) === NaN`, which is
	// always false because NaN is never equal to itself, so the check never fired.
	// It now uses Number.isNaN(). This test keeps it from regressing.
	test('rejects a non-integer year', () => {
		const errors = validateSubmittedDocument('editions', inputs({ editionYear: 'nineteen' }), {}, LOGGED_IN)
		expect(errors).toContain('Year must be an integer.')
	})
})

describe('validateSubmittedDocument — info', () => {
	test('requires a number for sorting', () => {
		const errors = validateSubmittedDocument('info', inputs({ documentNumber: '' }), {}, LOGGED_IN)
		expect(errors).toContain('Info pages must have a number for sorting.')
	})

	test('accepts a supplied number', () => {
		expect(validateSubmittedDocument('info', inputs({ documentNumber: '3' }), {}, LOGGED_IN)).toEqual([])
	})
})

describe('validateSubmittedDocument — media', () => {
	const file = type => [{ type }]

	test('requires a file or a URL when creating a new media document', () => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: undefined, externalURL: '' }), {}, LOGGED_IN)
		expect(errors).toContain('Please choose an image or YouTube video first.')
	})

	test('does not require a new file when editing an existing media document', () => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: undefined, externalURL: '' }), { id: 'abc' }, LOGGED_IN)
		expect(errors).toEqual([])
	})

	test('accepts a YouTube URL with no file', () => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: undefined, externalURL: 'https://youtu.be/xyz' }), {}, LOGGED_IN)
		expect(errors).toEqual([])
	})

	test.each([['image/jpeg'], ['image/png']])('accepts %s uploads', type => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: file(type), externalURL: '' }), {}, LOGGED_IN)
		expect(errors).toEqual([])
	})

	test('names the offending type when rejecting an upload', () => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: file('application/pdf'), externalURL: '' }), {}, LOGGED_IN)
		expect(errors).toContain("You've uploaded an image in an unsupported file type: application/pdf")
	})

	// The frontend allowlist is image/jpeg and image/png only, but the backend's
	// config.ALLOWED_EXTENSIONS permits gif, mov, mp4, mp3 and wav. Anything the
	// backend would happily store is blocked in the editor UI.
	test('rejects gif, which the backend would accept (front/back mismatch)', () => {
		const errors = validateSubmittedDocument(
			'media', inputs({ uploadFile: file('image/gif'), externalURL: '' }), {}, LOGGED_IN)
		expect(errors).toContain("You've uploaded an image in an unsupported file type: image/gif")
	})
})

describe('validateSubmittedAnnotation', () => {
	const note = { id: 'note-1' }
	const tag = { id: 'tag-1' }

	test('requires a note', () => {
		expect(validateSubmittedAnnotation({}, tag, 'chapters')).toContain('Please choose a note.')
	})

	test('requires a tag when annotating a chapter', () => {
		expect(validateSubmittedAnnotation(note, {}, 'chapters')).toContain('Please choose a tag.')
	})

	test('does not require a tag outside chapters', () => {
		expect(validateSubmittedAnnotation(note, {}, 'notes')).toEqual([])
	})

	test('a note and tag together are valid for a chapter', () => {
		expect(validateSubmittedAnnotation(note, tag, 'chapters')).toEqual([])
	})
})
