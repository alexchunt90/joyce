import React from 'react'

import actions from '../actions'
import api from '../modules/api'
// import {convertToSearchText} from '../modules/editorSettings'
import regex from '../modules/regex'

const formHeaders = {
	headers: {
	  "Content-Type": "multipart/form-data",
	}
}

// API Middleware
const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				api.HTTPGetDocumentList(action.docType).then(response =>
					store.dispatch(actions.getDocumentList(response))
				)
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				api.HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(actions.getDocumentText(response))
				)
			}
			break
		case 'GET_MEDIA_DOCS':
			if (action.status === 'request') {
				api.HTTPPostRetrieveDocuments(action.media_doc_ids, action.docType).then(response =>
					store.dispatch(actions.getMediaDocs(response))
				)
			}
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request' && action.docType === 'media') {
				// Flask expects formData for image uploads
				const mediaForm = new FormData()
				// Select the first element from the FileList object
				if (action.data.uploadFile) {
					const file = action.data.uploadFile[0]
					mediaForm.append('uploadFile', file)
				}
				mediaForm.append('title', action.data.title)
				mediaForm.append('html_source', action.data.html_source)
				mediaForm.append('search_text', action.data.search_text)
				if (action.id) {
					api.HTTPPostWriteMediaDocument(action.id, action.docType, mediaForm, formHeaders).then(response =>
						store.dispatch(actions.saveDocument(response))
				)} else {
					api.HTTPPostCreateMediaDocument(action.docType, mediaForm, formHeaders).then(response =>
						store.dispatch(actions.saveDocument(response))
					)
				}				
			}
			if (action.status === 'request' && action.docType !== 'media') {
				if (action.id) {
					api.HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
						store.dispatch(actions.saveDocument(response))
				)} else {
					api.HTTPPutCreateDocument(action.docType, action.data).then(response =>
						store.dispatch(actions.saveDocument(response))
					)
				}				
			}			
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				api.HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(actions.deleteDocument(response))
				)
			}
			break
		case 'GET_SEARCH_RESULTS':
			if (action.status === 'request') {
				api.HTTPPostSearchResults(action.data).then(response =>
					store.dispatch(actions.getSearchResults(response))
				)
			}
			break
		default:
			break
	}
}

export default joyceAPI