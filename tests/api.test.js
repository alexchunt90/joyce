const api = require('../src/modules/api')

// beforeEach(() => {

// })

// Chapters

test('API returned chapter list', () => {
	expect.assertions(3)
	return api.default.HTTPGetDocumentList('chapters').then(response => {
		expect(response.status).toBe('success')
		expect(response.docType).toBe('chapters')
		expect(response.data.length).toBe(18)
	})
})

test('API returned chapter document', () => {
	expect.assertions(5)
	return api.default.HTTPGetDocumentText('AWNM3N3mxgFi4og697un', 'chapters').then(response => {
		expect(response.status).toBe('success')
		expect(response.docType).toBe('chapters')
		expect(response.data.title).toBe('Telemachus')
		expect(response.data.number).toBe(1)
		expect(response.data.html_source).toBeDefined()
	})
})

test('API successfully edited document', () => {
	expect.assertions(3)
	const updatedChapter = {
		number: 1,
		title: 'Odyssey',
		html_source: 'No more text.'
	}
	return api.default.HTTPPostWriteDocument('AWNM3N3mxgFi4og697un', 'chapters', updatedChapter).then(response => {
		console.log(response.data)
		expect(response.status).toBe('success')
		expect(response.data.length).toBe(18)
		expect(response.data[0].title).toBe('Odyssey')
	})
})

test('API successfully created document', () => {
	expect.assertions(3)
	const newChapter = {
		title: 'Test',
		number: 19,
		html_source: '<p>Ithaca!</p>'
	}
	return api.default.HTTPPutCreateDocument('chapters', newChapter).then(response => {
		expect(response.status).toBe('success')
		expect(response.data.length).toBe(19)
		expect(response.data.slice(-1)[0].title).toBe('Test')
	})
})

test('API successfully deleted document', () => {
	expect.assertions(3)
	return api.default.HTTPDeleteDocument('AWNM3N3mxgFi4og697un', 'chapters').then(response => {
		expect(response.status).toBe('success')
		expect(response.data.length).toBe(18)
		expect(response.data[0].title).toBe('Nestor')
	})
})