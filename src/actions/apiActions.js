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
		}),
	uploadMediaToS3Request: (response, data) =>
		({
			type: 'UPLOAD_TO_S3_REQUEST',
			file: data,
			signed_post: response.data
		}),
	uploadMediaToS3Response: (response) =>
		({
			type: 'UPLOAD_TO_S3_RESPONSE',
			status: response.status,
			url: response.url ? response.url : undefined
		}),
}

export default apiActions