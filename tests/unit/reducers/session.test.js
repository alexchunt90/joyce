// user and userErrors both use a switch whose cases guard with `if` but omit
// `break`, so a non-matching action falls through into later cases. These tests
// pin the intended behaviour and mark the places where fallthrough currently
// produces the wrong result.

import user from '../../../src/reducers/user'
import userErrors from '../../../src/reducers/userErrors'

const LOGGED_OUT = { isLoggedIn: false }
const LOGGED_IN = { user_name: 'Alex', isLoggedIn: true }

describe('user', () => {
	test('defaults to logged out', () => {
		expect(user(undefined, { type: '@@INIT' })).toEqual(LOGGED_OUT)
	})

	test('a successful OAuth exchange logs the editor in', () => {
		expect(user(LOGGED_OUT, {
			type: 'OAUTH_TOKEN_AUTHORIZATION', status: 'success', data: { user_name: 'Alex' },
		})).toEqual(LOGGED_IN)
	})

	test('a successful logout returns to the default state', () => {
		expect(user(LOGGED_IN, { type: 'USER_LOGOUT_RESPONSE', status: 'success' })).toEqual(LOGGED_OUT)
	})

	test('resuming a session from the cookie logs the editor back in', () => {
		expect(user(LOGGED_OUT, { type: 'USER_LOGIN_REFRESH', user_name: 'Alex' })).toEqual(LOGGED_IN)
	})

	test('ignores unrelated actions', () => {
		expect(user(LOGGED_IN, { type: 'TOGGLE_HIGHLIGHT' })).toBe(LOGGED_IN)
	})

	// Regression guard: this case guarded on status === 'success' without a break, so a
	// failed login fell through USER_LOGOUT_RESPONSE into USER_LOGIN_REFRESH and
	// returned isLoggedIn: true, presenting the UI as signed in.
	test('a failed OAuth exchange leaves the editor logged out', () => {
		expect(user(LOGGED_OUT, { type: 'OAUTH_TOKEN_AUTHORIZATION', status: 'error' }))
			.toEqual(LOGGED_OUT)
	})

	// Regression guard: the same fallthrough left a failed logout in USER_LOGIN_REFRESH,
	// which returned isLoggedIn: true with user_name undefined.
	test('a failed logout preserves the existing session', () => {
		expect(user(LOGGED_IN, { type: 'USER_LOGOUT_RESPONSE', status: 'error' })).toEqual(LOGGED_IN)
	})
})

describe('userErrors', () => {
	const httpError = status => ({ response: { status } })
	const AUTH_MESSAGE = 'The API refused your request. Try logging out and back in again in another tab.'
	const GENERIC_MESSAGE = 'The system encountered a problem. Contact your system admin.'

	test('defaults to no errors', () => {
		expect(userErrors(undefined, { type: '@@INIT' })).toEqual([])
	})

	test('stores editor validation errors verbatim', () => {
		const errors = ['Please enter a title.']
		expect(userErrors([], { type: 'RETURN_EDITOR_VALIDATION_ERRORS', errors })).toBe(errors)
	})

	test('delegates annotation validation', () => {
		expect(userErrors([], {
			type: 'SUBMIT_ANNOTATION', annotationNote: {}, annotationTag: {}, docType: 'chapters',
		})).toEqual(['Please choose a note.', 'Please choose a tag.'])
	})

	test('clears errors once a document loads', () => {
		expect(userErrors(['stale'], {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'currentDocument',
		})).toEqual([])
	})

	test('reports a failed login', () => {
		expect(userErrors([], { type: 'OAUTH_TOKEN_AUTHORIZATION', status: 'error' }))
			.toEqual(['Login Failed.'])
	})

	test('reports a failed logout', () => {
		expect(userErrors([], { type: 'USER_LOGOUT_RESPONSE', status: 'error' }))
			.toEqual(['Logout failed. Clear your cookies or contact system admin.'])
	})

	test.each([['SAVE_DOCUMENT'], ['DELETE_DOCUMENT']])(
		'%s rejected with 401 appends the re-authentication message', type => {
			expect(userErrors([], { type, status: 'error', data: httpError(401) }))
				.toEqual([AUTH_MESSAGE])
		})

	test.each([['SAVE_DOCUMENT'], ['DELETE_DOCUMENT']])(
		'%s failing for another reason appends the generic message', type => {
			expect(userErrors([], { type, status: 'error', data: httpError(500) }))
				.toEqual([GENERIC_MESSAGE])
		})

	test('appends rather than replacing existing errors', () => {
		expect(userErrors(['earlier'], {
			type: 'SAVE_DOCUMENT', status: 'error', data: httpError(500),
		})).toEqual(['earlier', GENERIC_MESSAGE])
	})

	// Regression guard: a failed document fetch fell through into the
	// OAUTH_TOKEN_AUTHORIZATION case, whose error branch matched, so a chapter that
	// simply failed to load told the reader "Login Failed."
	test('a failed document fetch does not report a login failure', () => {
		expect(userErrors([], {
			type: 'GET_DOCUMENT_TEXT', status: 'error', state: 'currentDocument',
		})).toEqual([])
	})

	// Regression guard: the same fallthrough in the other direction — loading an
	// annotation note reached the OAUTH case's success branch and wiped the errors
	// the editor was being shown.
	test('loading an annotation note does not clear pending errors', () => {
		expect(userErrors(['Please enter a title.'], {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote',
		})).toEqual(['Please enter a title.'])
	})
})
