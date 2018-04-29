//
// API Request Actions
//
	// These actions are handled by middleware and initiate
	// an API request.

	// Requesting the list of documents without complete text
	export const getDocumentList = (response = {}) =>
		({
			type: 'GET_DOCUMENT_LIST',
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data,
			state: response.state
		})

	// Requesting the full text of a given document
	export const getDocumentText = (response = {}) =>
		({
			type: 'GET_DOCUMENT_TEXT',
			id: response.id,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data,
			state: response.state,
		})

	// Deleting a given document
	export const deleteDocument = (response = {}) =>
		({
			type: 'DELETE_DOCUMENT',
			id: response.id,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data
		})

	// Saving a document, create or update depending on if it receives an id
	export const saveDocument = (response = {}) =>
		({
			type: 'SAVE_DOCUMENT',
			id: response.id ? response.id : null,
			docType: response.docType,
			status: response.status ? response.status : 'request',
			data: response.data
		})

	// Requesting search results with a search input
	export const getSearchResults = (response={}) => {
		return ({
			type: 'GET_SEARCH_RESULTS',
			data: response.data,
			status: response.status ? response.status : 'request'
		})
	}