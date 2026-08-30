// toggles drives the loading spinner and the reader's UI switches. Its
// GET_DOCUMENT_TEXT and GET_DOCUMENT_LIST cases guard with `if` but omit `break`,
// so actions that miss those guards fall through into CREATE_DOCUMENT and
// switch the spinner off.

import toggles from '../../../src/reducers/toggles'

const INITIAL = {
	loading: true,
	loadingPagination: true,
	highlights: true,
	pagination: false,
	admin: false,
	navCollapse: true,
}

describe('toggles', () => {
	test('starts in the loading state', () => {
		expect(toggles(undefined, { type: '@@INIT' })).toEqual(INITIAL)
	})

	test('requesting the current document shows the spinner and hides pagination', () => {
		const result = toggles({ ...INITIAL, loading: false, pagination: true }, {
			type: 'GET_DOCUMENT_TEXT', status: 'request', state: 'currentDocument',
		})
		expect(result.loading).toBe(true)
		expect(result.pagination).toBe(false)
	})

	test('receiving the current document hides the spinner', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
		}).loading).toBe(false)
	})

	test('CREATE_DOCUMENT hides the spinner for the blank editor', () => {
		expect(toggles(INITIAL, { type: 'CREATE_DOCUMENT' }).loading).toBe(false)
	})

	test.each([
		['TOGGLE_HIGHLIGHT', 'highlights'],
		['TOGGLE_PAGINATION', 'pagination'],
		['TOGGLE_NAV_COLLAPSE', 'navCollapse'],
	])('%s inverts %s', (type, key) => {
		expect(toggles(INITIAL, { type })[key]).toBe(!INITIAL[key])
		expect(toggles({ ...INITIAL, [key]: !INITIAL[key] }, { type })[key]).toBe(INITIAL[key])
	})

	test('SET_PAGINATION_EDITION clears the pagination spinner', () => {
		expect(toggles(INITIAL, { type: 'SET_PAGINATION_EDITION' }).loadingPagination).toBe(false)
	})

	test('CHOOSE_PAGINATION_EDITION switches pagination on', () => {
		expect(toggles(INITIAL, { type: 'CHOOSE_PAGINATION_EDITION' }).pagination).toBe(true)
	})

	test.each([
		['SHOW_ADMIN_HEADER', true],
		['HIDE_ADMIN_HEADER', false],
	])('%s sets admin to %s', (type, expected) => {
		expect(toggles(INITIAL, { type }).admin).toBe(expected)
	})

	test('navigating collapses the mobile nav', () => {
		expect(toggles({ ...INITIAL, navCollapse: false }, {
			type: '@@router/ON_LOCATION_CHANGED',
		}).navCollapse).toBe(true)
	})

	test('preserves unrelated keys when updating one', () => {
		const result = toggles({ ...INITIAL, highlights: false, admin: true }, {
			type: 'TOGGLE_PAGINATION',
		})
		expect(result.highlights).toBe(false)
		expect(result.admin).toBe(true)
	})

	test('ignores unrelated actions', () => {
		expect(toggles(INITIAL, { type: 'SOMETHING_ELSE' })).toBe(INITIAL)
	})

	// BUG (live): GET_DOCUMENT_LIST only returns when the list came back empty for the
	// current docType. Every other list action — including the initial 'request' for
	// each of the six docTypes dispatched at startup in src/joyce.js — falls through
	// into CREATE_DOCUMENT and sets loading: false. The spinner is dismissed before
	// the chapter text has arrived.
	test.failing('requesting a document list does not dismiss the spinner', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_LIST', status: 'request', docType: 'notes',
		}).loading).toBe(true)
	})

	// BUG (live): the same fallthrough for document fetches that are not the
	// currentDocument. Opening an annotation note in the modal clears the spinner for
	// the chapter underneath it.
	test.failing('fetching an annotation note does not dismiss the main spinner', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_TEXT', status: 'request', state: 'annotationNote',
		}).loading).toBe(true)
	})
})
