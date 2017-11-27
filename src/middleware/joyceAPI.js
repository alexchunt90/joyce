import axios from 'axios'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	setCurrentChapter,
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

const HTTPGetDocumentText = (id, docType) =>
	axios.get(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
	})

const HTTPDeleteDocument = (id, docType) =>
	axios.delete(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
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
				HTTPGetDocumentText(action.id, action.docType).then(response =>
					store.dispatch(getDocumentText(response))
				)
			}
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request') {
				HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
					store.dispatch(saveDocument(response))
				)
			} else if (action.status === 'success') {
				store.dispatch(setCurrentChapter(action.id))
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			} else if (action.status === 'success') {
				store.dispatch(setCurrentChapter(action.data[0].number))
			}
			break
		// Chapter Action Middleware
		case 'SET_CURRENT_CHAPTER':
			store.dispatch(getDocumentText({id: action.id, docType: 'chapters'}))
			break
		case 'SUBMIT_CHAPTER_EDIT':
			store.dispatch(saveDocument({id: action.document.number, docType: 'chapters', data: action.document}))
			break
		case 'DELETE_CURRENT_CHAPTER':
			store.dispatch(deleteDocument({id: action.id, docType: 'chapters'}))
			break						
		case 'CREATE_CHAPTER':
			if (!action.chapterNumber) {
				const chapterNumber = store.getState().chapters.length + 1
				store.dispatch(createNewChapter(chapterNumber))
			}
			break
		default:
			break
	}
}