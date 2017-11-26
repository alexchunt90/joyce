export const setChapterToRead = id =>
	({
		type: 'SET_READ_CHAPTER',
		id: id
	})

export const setNoteToRead = id =>
	({
		type: 'SET_READ_NOTE',
		id: id
	})	

export const setChapterToEdit = id =>
	({
		type: 'SET_EDITED_CHAPTER',
		id: id
	})

export const readTextReceived = data =>
	({
		type: 'GET_TEXT_DATA_RECEIVED',
		data: data
	})

export const readTextError = error =>
	({
		type: 'GET_TEXT_DATA_ERROR',
		error: error
	})

export const toggleHighlight = () =>
	({
		type: 'TOGGLE_HIGHLIGHT'
	})

export const editTextReceived = data =>
	({
		type: 'UPDATE_EDITED_CHAPTER',
		data: data
	})

export const editTextError = error =>
	({
		type: 'GET_TEXT_DATA_ERROR',
		error: error
	})

export const updateChapterTitleInput = chapterTitleInput => {
	return ({
		type: 'UPDATE_CHAPTER_TITLE',
		data: chapterTitleInput.target.value
	})
}

export const updateEditorState = editorState =>
	({
		type: 'UPDATE_EDITOR_STATE',
		data: editorState
	})

export const chapterDataReceived = data =>
	({
		type: 'GET_CHAPTER_DATA_RECEIVED',
		data
	})

export const chapterDataError = error =>
	({
		type: 'GET_CHAPTER_DATA_ERROR',
		error		
	})

export const createNewChapter = () =>
	({
		type: 'CREATE_CHAPTER'
	})

export const submitChapter = document =>
	({
		type: 'SUBMIT_CHAPTER_EDIT',
		document: document
	})

export const deleteChapter = id =>
	({
		type: 'DELETE_CURRENT_CHAPTER',
		id: id
	})

export const deleteChapterSuccess = (id, data) =>
	({
		type: 'DELETE_CHAPTER_SUCCESS',
		id: id,
		data: data
	})

export const deleteChapterError = error =>
	({
		type: 'DELETE_CHAPTER_ERROR'
	})

export const saveDocumentSuccess = (id, data) =>
	({
		type: 'SAVE_DOCUMENT_SUCCESS',
		id: id,
		data: data
	})

export const saveDocumentError = error =>
	({
		type: 'SAVE_DOCUMENT_ERROR',
		error: error
	})

export const getChapterList = () =>
	({
		type: 'GET_CHAPTER_DATA'
	})

export const getNoteList = () =>
	({
		type: 'GET_NOTE_DATA'
	})	