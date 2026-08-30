// chapters, notes, info, tags, editions and media are six copies of the same
// reducer differing only in the docType they respond to. Testing them as a table
// makes the "responds only to its own docType" contract explicit — the property
// that stops a note save from clobbering the chapter list.

import chapters from '../../../src/reducers/chapters'
import notes from '../../../src/reducers/notes'
import info from '../../../src/reducers/info'
import tags from '../../../src/reducers/tags'
import editions from '../../../src/reducers/editions'
import media from '../../../src/reducers/media'

const reducers = [
	['chapters', chapters],
	['notes', notes],
	['info', info],
	['tags', tags],
	['editions', editions],
	['media', media],
]

const ALL_DOC_TYPES = reducers.map(([name]) => name)
const RESPONDS_TO = ['GET_DOCUMENT_LIST', 'SAVE_DOCUMENT', 'DELETE_DOCUMENT']

describe.each(reducers)('%s reducer', (docType, reducer) => {
	const payload = [{ id: 'a', title: 'First' }, { id: 'b', title: 'Second' }]

	test('defaults to an empty list', () => {
		expect(reducer(undefined, { type: '@@INIT' })).toEqual([])
	})

	test.each(RESPONDS_TO)('%s success for its own docType replaces the list', type => {
		expect(reducer([], { type, status: 'success', docType, data: payload })).toEqual(payload)
	})

	test.each(RESPONDS_TO)('%s for another docType leaves the list untouched', type => {
		const existing = [{ id: 'existing' }]
		for (const otherType of ALL_DOC_TYPES.filter(d => d !== docType)) {
			expect(reducer(existing, { type, status: 'success', docType: otherType, data: payload }))
				.toBe(existing)
		}
	})

	test.each(RESPONDS_TO)('%s with a non-success status leaves the list untouched', type => {
		const existing = [{ id: 'existing' }]
		for (const status of ['request', 'error']) {
			expect(reducer(existing, { type, status, docType, data: payload })).toBe(existing)
		}
	})

	test('ignores unrelated actions', () => {
		const existing = [{ id: 'existing' }]
		expect(reducer(existing, { type: 'TOGGLE_HIGHLIGHT' })).toBe(existing)
	})
})
