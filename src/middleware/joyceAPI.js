import { push } from 'react-router-redux'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	createNewChapter,
	getSearchResults
} from '../actions/apiActions'

import api from '../modules/api'
import regex from '../modules/regex'

// API Middleware
const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				api.HTTPGetDocumentList(action.docType, action.state).then(response =>
					store.dispatch(getDocumentList(response))
				)
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				api.HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(getDocumentText(response))
				)
			}	
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request') {
				if (action.id) {
					api.HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
						store.dispatch(saveDocument(response)
					)
				)} else {
					api.HTTPPutCreateDocument(action.docType, action.data).then(response =>
						store.dispatch(saveDocument(response))
					)
				}
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				api.HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			}
			break
		case 'GET_SEARCH_RESULTS':
			if (action.status === 'request') {
				api.HTTPPostSearchResults(action.data).then(response =>
					store.dispatch(getSearchResults(response))
				)
			}
			break			
		default:
			break
	}
}

export default joyceAPI