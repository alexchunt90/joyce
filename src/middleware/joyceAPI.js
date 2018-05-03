import axios from 'axios'
import { push } from 'react-router-redux'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	createNewChapter,
	getSearchResults
} from '../actions/apiActions'

import { setCurrentDocument } from '../actions/userActions'

import { 
	HTTPGetDocumentList, 
	HTTPGetDocumentText, 
	HTTPDeleteDocument, 
	HTTPPutCreateDocument, 
	HTTPPostWriteDocument, 
	HTTPPostSearchResults } from './http'

import helpers from '../modules/helpers'

// API Middleware
export const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		// API Calls
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				HTTPGetDocumentList(action.docType, action.state).then(response =>
					store.dispatch(getDocumentList(response))
				)
			}
			if (action.status === 'success' && action.docType === store.getState().docType && !store.getState().currentDocument.id) {
				if (helpers.checkIfRedirectPath(store.getState().routerReducer.location.pathname)) {
					if (action.docType === 'chapters') {
						store.dispatch(push(action.data[0].number))
					} else {
						store.dispatch(push(action.data[0].id))
					}
				}
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(getDocumentText(response))
				)
			}	
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request') {
				if (action.id) {
					HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
					store.dispatch(saveDocument(response))
				)} else {
					HTTPPutCreateDocument(action.docType, action.data).then(response =>
					store.dispatch(saveDocument(response)))
				}
			} else if (action.status === 'success' && !action.id) {
				store.dispatch(setCurrentDocument(action.data.slice(-1)[0].id, action.docType))
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			} else if (action.status === 'success') {
				if (action.data[0]) {
					store.dispatch(setCurrentDocument(action.data[0].id, action.docType, 'currentDocument'))
				}
			}
			break
		default:
			break
	}
}