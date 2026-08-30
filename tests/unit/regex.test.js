// Path parsing is the foundation joyceRouter sits on: every routing decision in
// src/middleware/joyceRouter.js is made by asking these functions about
// location.pathname. Pinning them first means a change to the router can be
// distinguished from a change to the path grammar underneath it.

import regex from '../../src/modules/regex'

// A real Elasticsearch document id, as it appears in reader/editor URLs.
const ES_ID = 'AWNM3N3mxgFi4og697un'

describe('checkPathForNumber / parseNumberFromPath', () => {
	test.each([
		['/1', 1],
		['/4', 4],
		['/18', 18],
		['/999', 999],
	])('%s is a chapter number path parsing to %i', (path, expected) => {
		expect(regex.checkPathForNumber(path)).toBe(true)
		expect(regex.parseNumberFromPath(path)).toBe(expected)
	})

	test.each([
		['/', 'root'],
		['/:id', 'redirect placeholder'],
		['/notes', 'docType with no identifier'],
		['/1234', 'four digits — the pattern caps at three'],
		[`/notes/${ES_ID}`, 'an id, not a number'],
	])('%s is not a chapter number path (%s)', path => {
		expect(regex.checkPathForNumber(path)).toBe(false)
	})

	test('a number anywhere in the path only counts at the end', () => {
		expect(regex.checkPathForNumber('/edit/4')).toBe(true)
		expect(regex.parseNumberFromPath('/edit/4')).toBe(4)
	})

	// Sharp edge worth pinning: the parse helper returns null on no-match, and
	// Number(null) is 0 — not NaN and not undefined. joyceRouter guards every call
	// with checkPathForNumber() first, which is the only reason this is safe.
	test('parseNumberFromPath returns 0, not NaN, for a non-matching path', () => {
		expect(regex.parseNumberFromPath('/notes')).toBe(0)
	})
})

describe('checkIfRootPathWithNumber', () => {
	test('is anchored to the root, unlike checkPathForNumber', () => {
		expect(regex.checkIfRootPathWithNumber('/4')).toBe(true)
		expect(regex.checkIfRootPathWithNumber('/edit/4')).toBe(false)
	})
})

describe('checkPathForID / parseIDFromPath', () => {
	test.each([
		[`/${ES_ID}`],
		[`/notes/${ES_ID}`],
		[`/edit/notes/${ES_ID}`],
		[`/edit/media/${ES_ID}`],
	])('%s parses out the document id', path => {
		expect(regex.checkPathForID(path)).toBe(true)
		expect(regex.parseIDFromPath(path)).toBe(ES_ID)
	})

	test('ids shorter than 18 characters are not recognised', () => {
		expect(regex.checkPathForID('/tooshort')).toBe(false)
		expect(regex.parseIDFromPath('/tooshort')).toBeNull()
	})

	test('hyphens and underscores are valid id characters', () => {
		const id = 'abc-def_ghi-jkl_mno123'
		expect(regex.parseIDFromPath(`/notes/${id}`)).toBe(id)
	})

	// PATH_WITH_ID and PATH_ROOT_WITH_ID are currently the *same* regex despite the
	// names implying the second is root-anchored. This test documents that they are
	// interchangeable today, so that "fixing" one without the other trips a failure.
	test('checkIfRootPathWithID behaves identically to checkPathForID', () => {
		for (const path of [`/${ES_ID}`, `/edit/notes/${ES_ID}`, '/tooshort']) {
			expect(regex.checkIfRootPathWithID(path)).toBe(regex.checkPathForID(path))
		}
	})
})

describe('checkIfDocTypePath / parseDocTypeFromPath', () => {
	test.each([
		['/notes', 'notes'],
		['/info', 'info'],
		['/chapters', 'chapters'],
		['/tags', 'tags'],
		['/editions', 'editions'],
		['/media', 'media'],
		['/edit/notes', 'notes'],
		['/edit/media', 'media'],
		[`/edit/tags/${ES_ID}`, 'tags'],
	])('%s has docType %s', (path, expected) => {
		expect(regex.checkIfDocTypePath(path)).toBe(true)
		expect(regex.parseDocTypeFromPath(path)).toBe(expected)
	})

	test.each([
		['/'],
		['/4'],
		['/edit'],
		['/search'],
		['/admin'],
	])('%s has no docType', path => {
		expect(regex.checkIfDocTypePath(path)).toBe(false)
		expect(regex.parseDocTypeFromPath(path)).toBeNull()
	})
})

describe('redirect and root paths', () => {
	test('checkIfRedirectPath matches any path ending in :id', () => {
		expect(regex.checkIfRedirectPath('/:id')).toBe(true)
		expect(regex.checkIfRedirectPath('/edit/:id')).toBe(true)
		expect(regex.checkIfRedirectPath('/edit/notes/:id')).toBe(true)
		expect(regex.checkIfRedirectPath('/4')).toBe(false)
	})

	test('checkIfRootPath matches only the root and the bare :id placeholder', () => {
		expect(regex.checkIfRootPath('/')).toBe(true)
		expect(regex.checkIfRootPath('/:id')).toBe(true)
		expect(regex.checkIfRootPath('/4')).toBe(false)
		expect(regex.checkIfRootPath('/edit/:id')).toBe(false)
	})
})

describe('editor routes', () => {
	test.each([
		['/edit'],
		['/edit/'],
		['/edit/notes'],
		[`/edit/notes/${ES_ID}`],
	])('%s is an editor route', path => {
		expect(regex.checkEditRoute(path)).toBe(true)
	})

	test.each([['/'], ['/4'], ['/notes'], ['/search']])('%s is not an editor route', path => {
		expect(regex.checkEditRoute(path)).toBe(false)
	})

	test('checkEditBaseRoute matches only the bare /edit path', () => {
		expect(regex.checkEditBaseRoute('/edit')).toBe(true)
		expect(regex.checkEditBaseRoute('/edit/')).toBe(false)
		expect(regex.checkEditBaseRoute('/edit/notes')).toBe(false)
	})

	// PATH_EDITOR is /^\/edit(\/)*/ with no word boundary, so any path beginning with
	// the letters "edit" matches — including the reader's /editions routes. Currently
	// masked in joyceRouter because every use is paired with !checkIfDocTypePath(),
	// but it is a live trap for the next caller.
	test('checkEditRoute reports /editions as an editor route (known sharp edge)', () => {
		expect(regex.checkEditRoute('/editions')).toBe(true)
		expect(regex.checkEditRoute(`/editions/${ES_ID}`)).toBe(true)
	})
})

describe('checkColorPickerHexValue', () => {
	test.each([['FFFFFF'], ['000000'], ['FF0000'], ['ABC'], ['FFF']])(
		'%s is a valid hex colour', value => {
			expect(regex.checkColorPickerHexValue(value)).toBe(true)
		})

	test.each([
		['#FFFFFF', 'leading hash is not allowed'],
		['FFFF', 'four digits is neither 3 nor 6'],
		['GGGGGG', 'non-hex characters'],
		['', 'empty string'],
	])('%s is rejected (%s)', value => {
		expect(regex.checkColorPickerHexValue(value)).toBe(false)
	})

	// The HEX_COLOR pattern has no `i` flag, so lowercase hex is rejected. Tag colours
	// typed in lowercase fail validation with "Please select a valid hex code color."
	test('lowercase hex is rejected (known defect — pattern lacks the i flag)', () => {
		expect(regex.checkColorPickerHexValue('ff0000')).toBe(false)
		expect(regex.checkColorPickerHexValue('abc')).toBe(false)
	})
})

describe('checkIntegerInput', () => {
	test.each([['0'], ['1'], ['1922'], ['000']])('%s is an integer', value => {
		expect(regex.checkIntegerInput(value)).toBe(true)
	})

	test.each([['-1'], ['1.5'], ['abc'], ['19a22']])('%s is not an integer', value => {
		expect(regex.checkIntegerInput(value)).toBe(false)
	})

	// IS_INTEGER is /^[0-9]*$/ — zero-or-more, so the empty string passes. Any caller
	// using this to require a value needs its own emptiness check.
	test('the empty string passes (pattern uses * rather than +)', () => {
		expect(regex.checkIntegerInput('')).toBe(true)
	})
})
