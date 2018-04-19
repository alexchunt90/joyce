import axios from 'axios'
import { stateToHTML } from 'draft-js-export-html'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	setCurrentDocument,
	createNewChapter,
} from '../actions'

import { getFirstDocument } from '../mixins/firstDocument'

let apiRoute = '/api/'

// Axios HTTP Functions
const HTTPGetDocumentList = (docType, state) =>
	axios.get(apiRoute + docType).then(res => {
		return {status: 'success', docType: docType, state: state, data: res.data}
	}).catch(error => {
		return {status: 'error', docType: docType, state: state, data: error}
	})

const HTTPGetDocumentText = (id, docType, state) =>
	axios.get(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, state: state, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, state: state, data: error}
	})

const HTTPDeleteDocument = (id, docType) =>
	axios.delete(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
	})

const HTTPPutCreateDocument = (docType, data) =>
	axios.put(apiRoute + docType + '/', data).then(res => {
		return {status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {status: 'error', docType: docType, data: error}
	})

const HTTPPostWriteDocument = (id, docType, data) =>
	axios.post(apiRoute + docType + '/' + id, data).then(res => {
		return {id: data.id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
	})

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
		// Document Action Middleware
		case 'SET_DOC_TYPE':
			const firstDocument = getFirstDocument(store, action.docType)
			if (firstDocument) {
				store.dispatch(getDocumentText({id: firstDocument.id, docType: action.docType, state: 'currentDocument'}))
			}
			break
		case 'SET_CURRENT_DOCUMENT':
			store.dispatch(getDocumentText({id: action.id, docType: action.docType, state: 'currentDocument'}))
			break
		case 'SUBMIT_DOCUMENT_EDIT':
			const textContent = action.editorState.getCurrentContent()
			const options = {
			  entityStyleFn: (entity) => {
			    const entityType = entity.get('type').toUpperCase()
			    if (entityType === 'LINK') {
			      const data = entity.getData()
			      return {
			        element: 'a',
			        attributes: {
		        		'href': data.url,
			        	'data-target': '#annotation_modal',
			        	'data-toggle': 'modal'
			        }
			      }
			    }
			  }
			}			
			const data = { title: action.documentTitleInput, text: stateToHTML(textContent, options) }
			if (action.currentDocument.id) {
				data.id = action.currentDocument.id
			}
			if (action.docType === 'chapters') {
				if (!action.currentDocument.id) {
					const nextNumber = store.getState().chapters.length + 1
					data.number = nextNumber
				} else {
					data.number = action.currentDocument.number
				} 
			}
			store.dispatch(saveDocument({id: data.id ? data.id : null, docType: action.docType, data: data}))
			break
		case 'DELETE_CURRENT_DOCUMENT':
			store.dispatch(deleteDocument({id: action.id, docType: action.docType}))
			break
		case 'CANCEL_EDIT':
			const docType = store.getState().docType
			const currentDocument = store.getState().currentDocument
			if (currentDocument.id) {
				store.dispatch(getDocumentText({id: currentDocument.id, docType: docType, state: 'currentDocument'}))
			} else {
				store.dispatch(getDocumentText({id: notes[0].id, docType: docType, state: 'currentDocument'}))
			}
			break
		// Annotation Action Middleware
		case 'SELECT_ANNOTATION_NOTE':
			store.dispatch(getDocumentText({id: action.id, docType: 'notes', state: 'annotationNote'}))
			break
		default:
			break
	}
}