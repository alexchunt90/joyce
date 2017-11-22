import axios from 'axios'

import { 
	chapterDataReceived, 
	chapterDataError, 
	readTextReceived, 
	readTextError, 
	editTextReceived,
	setChapterToEdit,
	editTextError, 
	getChapterList, 
	saveDocumentSuccess,
	saveDocumentError,
	deleteChapterSuccess,
	deleteChapterError,
} from '../actions'

let apiRoute = '/api/chapters/'

export const joyceAPI = store => next => action => {

	next(action)

	const getChapters = (receivedAction, errorAction) =>
		axios.get(apiRoute).then(res => {
			const data = res.data
			return next(receivedAction(data))
		}).catch(error => {
			return next(errorAction(error))
		})

	const getChapterText = (id, receivedAction, errorAction) =>
		axios.get(apiRoute + id).then(res => {
			const data = res.data
			return next(receivedAction(data))
		}).catch(error => {
			return next(errorAction(error))
		})

	const saveChapterText = (document, receivedAction, errorAction) =>
		axios.post(apiRoute + document.number, document).then(res => {
			store.dispatch(saveDocumentSuccess(document.number, res.data))
		}).catch(error => {
			store.dispatch(saveDocumentError(error))
		})

	const deleteChapter = id => {
		axios.delete(apiRoute + id).then(res => {
			store.dispatch(deleteChapterSuccess(id, res.data))
		}).catch(error => {
			store.dispatch(deleteChapterError(error))
		})
	}

	switch(action.type) {
		// Write chapters
		case 'SUBMIT_CHAPTER_EDIT':
			saveChapterText(action.document, getChapterList, saveDocumentError)
			break
		case 'SAVE_DOCUMENT_SUCCESS':
			store.dispatch(setChapterToEdit(action.id))
			break				
		// Delete documents
		case 'DELETE_CURRENT_CHAPTER':
			deleteChapter(action.id)
			break
		case 'DELETE_CHAPTER_SUCCESS':
			let previousChapter = action.id - 1
			store.dispatch(setChapterToEdit(previousChapter))
			break
		// Unclean
		case 'GET_CHAPTER_DATA':
			getChapters(chapterDataReceived, chapterDataError)
			break
		case 'SET_READ_CHAPTER':
			getChapterText(action.id, readTextReceived, readTextError)
			break
		case 'CREATE_CHAPTER':
			let chapterCount = store.getState().chapters.length
			const data = {
				number: chapterCount + 1,
				title: '',
				text: '',
			}
			store.dispatch(editTextReceived(data))
			break
		case 'SET_EDITED_CHAPTER':
			getChapterText(action.id, editTextReceived, editTextError)
			break
		default:
			break
	}
}