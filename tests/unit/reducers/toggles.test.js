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

	// Regression guard: every list action that missed the guard fell through into
	// CREATE_DOCUMENT and set loading: false — including the six 'request' actions
	// dispatched at startup in src/joyce.js, which dismissed the spinner before any
	// chapter text had arrived.
	test('requesting a document list does not dismiss the spinner', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_LIST', status: 'request', docType: 'notes',
		}).loading).toBe(true)
	})

	// Consequence of the fix above, pinned deliberately. The GET_DOCUMENT_LIST guard
	// requires action.state === 'currentDocType', but nothing in src/ ever dispatches
	// that field — it is dead code, and the fallthrough was the only thing clearing
	// the spinner for list actions. With the fallthrough gone, a docType whose list
	// comes back empty never fetches document text, so `loading` stays true and the
	// spinner hangs. Reachable on a fresh install or an empty media library.
	// The real fix belongs where docType context exists (joyceRouter/joyceInterface),
	// not here; this test records the current behaviour so that work is deliberate.
	test('an empty document list does not clear the spinner (dead guard — see comment)', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_LIST', status: 'success', docType: 'media', data: [],
		}).loading).toBe(true)
	})

	// Regression guard: the same fallthrough for fetches that are not the
	// currentDocument — opening an annotation note cleared the spinner for the
	// chapter underneath it.
	test('fetching an annotation note does not dismiss the main spinner', () => {
		expect(toggles(INITIAL, {
			type: 'GET_DOCUMENT_TEXT', status: 'request', state: 'annotationNote',
		}).loading).toBe(true)
	})
})
