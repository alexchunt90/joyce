import { readerDecorator, convertToSearchText, returnEditorStateFromHTML } from '../src/modules/editorSettings.js'
import api from '../src/modules/api.js'
import { JSDOM } from 'jsdom'

// DraftJS requires the browser DOM, so we fake it here
const jsdomWindow = new JSDOM('<div></div>').window
const document = jsdomWindow.document
global.document = document
global.HTMLElement = jsdomWindow.HTMLElement

// TODO: Figure out why TLS is getting rejected
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'


async function updateSearchText(id, data) {
	const promise = api.HTTPUpdateSearchText(id, data)
	const response = await promise
	if (response.status === 'success'){
		console.log('===> Successfuly posted.')
	} else {
		console.log('===> Post failed:', response.code)
	}
}

async function processSearchText(id, docType) {
	const promise = api.HTTPGetDocumentText(id, docType, 'currentDocument')
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
			const searchText = convertToSearchText(editorState.getCurrentContent())
			const updateData = {
				doc_type: docType,
				search_text: searchText
			}
			updateSearchText(id, updateData)
		} else {
			console.log('PROCESSING FAILED: Doc:')
			console.log(response)
		}
	} else {console.log('=> Search text exists for doc titled', response.data.title)}
}	

// Iterate through docTypes
const relevantDocTypes = ['chapters', 'notes']
for (const docType of relevantDocTypes) {
	console.log('Processing search text for', docType)
	// Get all the documents	
	api.HTTPGetDocumentList(docType).then(response => {
		console.log(response)
		if (response.status === 'success') {
			response.data.forEach((docRef, index) => {
				// const interval = 50
				// Apply a delay to each subsequent API call, preventing closed connecction
				// setTimeout(()=>{
					// Get the full document text
					processSearchText(docRef.id, docType)
				// }, index * interval)
			})
		}
	})
}
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'