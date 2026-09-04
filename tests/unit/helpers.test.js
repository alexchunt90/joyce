// Small lookup helpers shared by the containers. documentsOfDocType in particular
// is positional — its own source comments call it out — so these tests pin the
// argument order that every call site depends on.

import helpers from '../../src/modules/helpers'

const CHAPTERS = [
	{ id: 'ch-1', number: 1, title: 'Telemachus' },
	{ id: 'ch-4', number: 4, title: 'Calypso' },
	{ id: 'ch-18', number: 18, title: 'Penelope' },
]

describe('getChapterIDFromPath', () => {
	test.each([
		['/1', 'ch-1'],
		['/4', 'ch-4'],
		['/18', 'ch-18'],
		['/edit/4', 'ch-4'],
	])('%s resolves to %s', (path, expected) => {
		expect(helpers.getChapterIDFromPath(path, CHAPTERS)).toBe(expected)
	})

	test('returns undefined when no chapter has that number', () => {
		expect(helpers.getChapterIDFromPath('/99', CHAPTERS)).toBeUndefined()
	})

	test('returns undefined when the chapter list is empty', () => {
		expect(helpers.getChapterIDFromPath('/1', [])).toBeUndefined()
	})

	// regex.parseNumberFromPath yields 0 for a path with no trailing number, and the
	// comparison here is loose (==), so a chapter numbered 0 would match any
	// non-numeric path. No such chapter exists — numbering starts at 1 — but the
	// coupling is worth pinning.
	test('a path with no number matches nothing in a normally-numbered list', () => {
		expect(helpers.getChapterIDFromPath('/notes', CHAPTERS)).toBeUndefined()
	})
})

describe('docTypeName', () => {
	test.each([
		['chapters', 'Chapter'],
		['notes', 'Note'],
		['tags', 'Tags'],
		['media', 'Media'],
	])('%s is displayed as %s', (docType, expected) => {
		expect(helpers.docTypeName(docType)).toBe(expected)
	})

	// 'info' and 'editions' are both real docTypes with editor routes, but neither has
	// a case in the switch, so the UI renders undefined where a label belongs.
	test.each([['info'], ['editions']])('%s has no display name (known gap)', docType => {
		expect(helpers.docTypeName(docType)).toBeUndefined()
	})
})

describe('documentsOfDocType', () => {
	// The signature is (docType, chapters, notes, tags, editions, media, info) — note
	// that info is last, not grouped with the other document types. Passing these
	// out of order silently returns the wrong collection.
	const chapters = [{ id: 'ch' }]
	const notes = [{ id: 'note' }]
	const tags = [{ id: 'tag' }]
	const editions = [{ id: 'ed' }]
	const media = [{ id: 'med' }]
	const info = [{ id: 'info' }]

	const lookup = docType =>
		helpers.documentsOfDocType(docType, chapters, notes, tags, editions, media, info)

	test.each([
		['chapters', chapters],
		['notes', notes],
		['tags', tags],
		['editions', editions],
		['media', media],
		['info', info],
	])('%s returns its own collection', (docType, expected) => {
		expect(lookup(docType)).toBe(expected)
	})

	test('an unknown docType returns undefined', () => {
		expect(lookup('nonsense')).toBeUndefined()
	})
})

// The reader stopped fetching these two lists at boot: notes is ~1,200 documents (247KB)
// and media ~4,000 (782KB), and a reader on a chapter reads neither. These pin exactly
// which routes still pull them, because getting the predicate wrong is either a blank
// notes sidebar or the regression the change exists to remove.
describe('notesListNeeded', () => {
	test.each([
		['/', false],
		['/:id', false],
		['/1', false],
		['/18', false],
		['/search', false],
		['/admin', false],
		['/notes', true],
		['/notes/:id', true],
		['/notes/noteAAAAAAAAAAAAAA01', true],
		['/notes/index', true],
		['/notes/tally', true],
		['/info/infoAAAAAAAAAAAAAA03', true],
		['/edit', true],
		['/edit/notes', true],
		['/edit/chapters', true],
	])('%s -> %s', (path, expected) => {
		expect(helpers.notesListNeeded(path)).toBe(expected)
	})
})

describe('mediaListNeeded', () => {
	test.each([
		['/', false],
		['/1', false],
		['/notes/noteAAAAAAAAAAAAAA01', false],
		['/info/infoAAAAAAAAAAAAAA03', false],
		['/search', false],
		['/edit', true],
		['/edit/media', true],
		['/edit/notes', true],
	])('%s -> %s', (path, expected) => {
		expect(helpers.mediaListNeeded(path)).toBe(expected)
	})
})

