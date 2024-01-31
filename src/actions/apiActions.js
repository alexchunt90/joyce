// -------------------
// API Request Actions
// -------------------
// These actions are handled by middleware and initiate an API request.

const apiActions = {
	// Requesting the list of documents without complete text
	getDocumentList: (response = {}) =>
		({
			type: 'GET_DOCUMENT_LIST',
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data,
			state: response.state
		}),
	// Requesting the full text of a given document
	getDocumentText: (response = {}) =>
		({
			type: 'GET_DOCUMENT_TEXT',
			id: response.id,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data,
			state: response.state,
		}),
	// Requesting media docs associated with a given note
	getMediaDocs: (response = {}) =>
		({
			type: 'GET_MEDIA_DOCS',
			media_doc_ids: response.media_doc_ids,
			docType: 'media',
			status: response.status || 'request',
			data: response.data || {}
		}),
	// Deleting a given document
	deleteDocument: (response = {}) =>
		({
			type: 'DELETE_DOCUMENT',
			id: response.id,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data
		}),
	// Saving a document, create or update depending on if it receives an id
	saveDocument: (response = {}) =>
		({
			type: 'SAVE_DOCUMENT',
			id: response.id ? response.id : null,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data
		}),
	// Requesting search results with a search input
	getSearchResults: (response={}) =>
		({
			type: 'GET_SEARCH_RESULTS',
			data: response.data,
			status: response.status ? response.status : 'request'
		})
}

export default apiActions