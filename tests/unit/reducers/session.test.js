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

	// BUG (live): OAUTH_TOKEN_AUTHORIZATION guards on status === 'success' but does not
	// break, so a *failed* login falls through USER_LOGOUT_RESPONSE into
	// USER_LOGIN_REFRESH, which returns {isLoggedIn: true} unconditionally. A rejected
	// login therefore presents the UI as signed in, with user_name undefined.
	// Server-side JWT checks still apply, so this is a misleading client state rather
	// than an authentication bypass — the editor appears usable until the API 401s.
	test.failing('a failed OAuth exchange leaves the editor logged out', () => {
		expect(user(LOGGED_OUT, { type: 'OAUTH_TOKEN_AUTHORIZATION', status: 'error' }))
			.toEqual(LOGGED_OUT)
	})

	// BUG (live): same fallthrough. A failed logout lands in USER_LOGIN_REFRESH and
	// returns {user_name: undefined, isLoggedIn: true}, so a logout that fails both
	// keeps the editor logged in and discards their name.
	test.failing('a failed logout preserves the existing session', () => {
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

	// BUG (live): GET_DOCUMENT_TEXT only returns when the fetch succeeded for the
	// currentDocument. A *failed* document fetch falls through into the
	// OAUTH_TOKEN_AUTHORIZATION case, whose `status === 'error'` branch matches, so
	// the reader is told "Login Failed." when a chapter simply failed to load.
	test.failing('a failed document fetch does not report a login failure', () => {
		expect(userErrors([], {
			type: 'GET_DOCUMENT_TEXT', status: 'error', state: 'currentDocument',
		})).toEqual([])
	})

	// BUG (live): same fallthrough in the other direction. Successfully loading an
	// annotation note reaches the OAUTH case's `status === 'success'` branch and
	// wipes any errors the editor was being shown.
	test.failing('loading an annotation note does not clear pending errors', () => {
		expect(userErrors(['Please enter a title.'], {
			type: 'GET_DOCUMENT_TEXT', status: 'success', state: 'annotationNote',
		})).toEqual(['Please enter a title.'])
	})
})
