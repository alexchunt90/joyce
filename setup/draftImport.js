import { JSDOM } from 'jsdom'
import axios from 'axios'
import https from 'https'

import { readerDecorator, convertToSearchText, returnEditorStateFromHTML } from '../src/modules/editorSettings.js'
import { stateToHTML } from '../src/modules/draftConversion.js'
// DraftJS requires the browser DOM, so we fake it here
const jsdomWindow = new JSDOM('<div></div>').window
const document = jsdomWindow.document
global.document = document
global.HTMLElement = jsdomWindow.HTMLElement

const env = process.env.HOST_ENVIRONMENT
const host = env === 'staging' ? 'https://joyce-staging.net' : 'https://localhost'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Do not do this in production
})

const instance = axios.create({ httpsAgent })

async function updateSearchText(id, data) {
	const promise = instance.post(host + '/api/search_text/' + id, data)
	const response = await promise
	if (response.statusText === 'OK'){
		console.log('===> Successfuly posted.')
	} else {
		console.log('===> Post failed:', response.code)
	}
}

async function processSearchText(id, docType) {
	const promise = instance.get(host + '/api/' + docType + '/' + id)
	const response = await promise
	const fullDoc = response.data
	// Check if it has search_text defined
	if (typeof fullDoc.search_text === 'undefined') {
		console.log('=> Processing search text for doc titled', response.data.title)
		// Get the HTML source
		const htmlSource = fullDoc.html_source
		if (htmlSource) {
			// Instantiate a DraftJS Editor using the HTML
			const editorState = returnEditorStateFromHTML(htmlSource, readerDecorator)
			// Convert to searchable plain text
			const newContentState = editorState.getCurrentContent()
			const searchText = convertToSearchText(newContentState)
			const searchHTML = stateToHTML(newContentState)
			const updateData = {
				doc_type: docType,
				html_source: searchHTML,
				search_text: searchText,
			}
			updateSearchText(id, updateData)
		} else {
			console.log('PROCESSING FAILED: Doc:', response.data.title)
		}
	} else {console.log('=> Search text exists for doc titled', response.data.title)}
}

async function processDocumentList(docType) {
	console.log('Processing search text for', docType)
	const promise = instance.get(host + '/api/' + docType)
	const response = await promise
	if (response.statusText === 'OK') {
		response.data.forEach((docRef, index) => {
			const interval = 100
			// Apply a delay to each subsequent API call, preventing overloading connections
			setTimeout(()=>{
				// Get the full document text
				processSearchText(docRef.id, docType)
			}, index * interval)
		})
	} else (console.log('Failed to retrieve documents.'))
	return 'OK!'
}

const docType = process.argv[2]
processDocumentList(docType)
