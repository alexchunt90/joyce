// Layer 0 acceptance test: proves the toolchain itself works.
//
// It asserts the three things that were broken or unconfigured before:
//   1. jsdom is installed and serves the configured origin
//   2. babel transforms `src/` ESM into something jest can require
//   3. the DOM globals src/modules/api.js depends on are present
//
// If this file fails, no other test in the suite can be trusted.

import regex from '../../src/modules/regex'

describe('test harness', () => {
	test('runs in a jsdom environment at the configured origin', () => {
		expect(typeof window).toBe('object')
		expect(window.location.origin).toBe('https://localhost')
	})

	test('exposes document.cookie, which api.js reads for the CSRF token', () => {
		expect(typeof document.cookie).toBe('string')
	})

	test('can import an ES module from src/', () => {
		expect(typeof regex.parseNumberFromPath).toBe('function')
		expect(regex.parseNumberFromPath('/4')).toBe(4)
	})
})
