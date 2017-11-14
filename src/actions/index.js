import axios from 'axios'
import EditorState from 'draft-js'

let apiRoute = '/api/chapters/'

const SELECT_CHAPTER = 'SELECT_CHAPTER'
const GET_CHAPTER_DATA = 'GET_CHAPTER_DATA'
const GET_CHAPTER_DATA_RECEIVED = 'GET_CHAPTER_DATA_RECEIVED'
const GET_CHAPTER_DATA_ERROR = 'GET_CHAPTER_DATA_ERROR'
const GET_TEXT_DATA = 'GET_TEXT_DATA'
const GET_TEXT_DATA_RECEIVED = 'GET_TEXT_DATA_RECEIVED'
const GET_TEXT_DATA_ERROR = 'GET_TEXT_DATA_ERROR'
const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE'
const TOGGLE_HIGHLIGHT = 'TOGGLE_HIGHLIGHT'
const UPDATE_CHAPTER_TITLE = 'UPDATE_CHAPTER_TITLE'
const CREATE_CHAPTER = 'CREATE_CHAPTER'

export const setChapterToRead = id =>
	({
		type: GET_TEXT_DATA,
		id: id
	})

export const toggleHighlight = () =>
	({
		type: TOGGLE_HIGHLIGHT
	})

export const updateChapterTitleInput = chapterTitleInput => {
	return ({
		type: UPDATE_CHAPTER_TITLE,
		data: chapterTitleInput.target.value
	})
}

export const updateEditorState = editorState =>
	({
		type: UPDATE_EDITOR_STATE,
		data: editorState
	})

export const chapterDataReceived = data =>
	({
		type: GET_CHAPTER_DATA_RECEIVED,
		data
	})

export const chapterDataError = error =>
	({
		type: GET_CHAPTER_DATA_ERROR,
		error		
	})

export const textDataReceived = data =>
	({
		type: GET_TEXT_DATA_RECEIVED,
		data
	})

export const textDataError = error =>
	({
		type: GET_TEXT_DATA_ERROR,
		error
	})

export const setChapterToEdit = chapter =>
	({
		type: SET_EDITED_CHAPTER,
		chapter
	})

export const createNewChapter = () =>
	({
		type: CREATE_CHAPTER
	})

export const logger = store => next => action => {
 	console.group(action.type)
	console.info('dispatching', action)
	let result = next(action)
	console.log('next state', store.getState())
	console.log('chapter count', store.getState().chapters.length)
	console.groupEnd(action.type)
	return result
}

export const joyceAPIService = store => next => action => {
	next(action)
	switch(action.type) {
		case GET_CHAPTER_DATA:
			axios.get(apiRoute).then(res => {
				const data = res.data
				return next(chapterDataReceived(data))
			}).catch(error => {
				return next(chapterDataError(error))
			})
			break
		case GET_TEXT_DATA:
			axios.get(apiRoute + action.id).then(res=> {
				const data = res.data
				return next(textDataReceived(data))
			}).catch(error => {
				return next(textDataError(error))
			})
			break
		case CREATE_CHAPTER:
			const nextNumber = store.getState().chapters.length + 1
			const chapter = {
				number: nextNumber,
				title: '',
				text: EditorState.createEmpty(),
			}
			store.dispatch(setChapterEditor(chapter))
			break
		defaut:
			break
	}
}

export const foo = 'bar'