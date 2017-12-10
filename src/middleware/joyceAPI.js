import axios from 'axios'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	setCurrentChapter,
	setCurrentNote,
	createNewChapter,
} from '../actions'

let apiRoute = '/api/'

// Axios HTTP Functions
const HTTPGetDocumentList = docType =>
	axios.get(apiRoute + docType).then(res => {
		return {status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {status: 'error', docType: docType, data: error}
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
		return {id: id, status: 'success', docType: docType, data: res.data}
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
				HTTPGetDocumentList(action.docType).then(response =>
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
			} else if (action.status === 'success') {
				if (action.docType === 'chapters') {
					store.dispatch(setCurrentChapter(action.data.slice(-1)[0].id))
				} else if (action.docType === 'notes') {
					store.dispatch(setCurrentNote(action.data.slice(-1)[0].id))
				}
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			} else if (action.status === 'success') {
				if (action.docType === 'chapters') {
					store.dispatch(setCurrentChapter(action.data[0].id))
				} else if (action.docType === 'notes') {
					store.dispatch(setCurrentNote(action.data[0].id))
				}
			}
			break
		// Chapter Action Middleware
		case 'SET_CURRENT_CHAPTER':
			store.dispatch(getDocumentText({id: action.id, docType: 'chapters', state: 'currentChapter'}))
			break
		case 'SUBMIT_CHAPTER_EDIT':
			store.dispatch(saveDocument({docType: 'chapters', data: action.document}))
			break
		case 'DELETE_CURRENT_CHAPTER':
			store.dispatch(deleteDocument({id: action.id, docType: 'chapters'}))
			break
		// Note Action Middleware
		case 'SET_CURRENT_NOTE':
			store.dispatch(getDocumentText({id: action.id, docType: 'notes', state: 'currentNote'}))
			break
		case 'SUBMIT_NOTE_EDIT':
			store.dispatch(saveDocument({docType: 'notes', data: action.document}))
			break
		case 'DELETE_CURRENT_NOTE':
			store.dispatch(deleteDocument({id: action.id, docType: 'notes'}))
			break
		case 'CANCEL_EDIT':
			const notes = store.getState().notes
			const currentNote = store.getState().currentNote
			if (currentNote.id) {
				store.dispatch(getDocumentText({id: currentNote.id, status: 'success', docType: 'notes', data: currentNote, state: 'currentNote'}))
			} else {
				store.dispatch(getDocumentText({id: notes[0].id, docType: 'notes', state: 'currentNote'}))
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