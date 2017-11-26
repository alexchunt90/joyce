// User Actions

export const setNoteToRead = id =>
	({
		type: 'SET_READ_NOTE',
		id: id
	})	

export const setNoteToEdit = id =>
	({
		type: 'SET_EDITED_NOTE',
		id: id
	})

export const createNewNote = () =>
	({
		type: 'CREATE_NOTE'
	})

export const submitNote = document =>
	({
		type: 'SUBMIT_NOTE_EDIT',
		document: document
	})

export const deleteNote = id =>
	({
		type: 'DELETE_CURRENT_NOTE',
		id: id
	})

export const updateNoteTitleInput = noteTitleInput => {
	return ({
		type: 'UPDATE_NOTE_TITLE',
		data: noteTitleInput.target.value
	})
}	

// Async API Requests

export const getNoteList = () =>
	({
		type: 'GET_NOTE_LIST'
	})	

// Async API Responses

export const getNoteListReceived = data =>
	({
		type: 'GET_NOTE_LIST_RECEIVED',
		data: data
	})

export const getNoteListError = error =>
	({
		type: 'GET_NOTE_LIST_ERROR',
		error: error
	})

export const deleteNoteSuccess = (id, data) =>
	({
		type: 'DELETE_NOTE_SUCCESS',
		id: id,
		data: data
	})

export const deleteNoteError = error =>
	({
		type: 'DELETE_NOTE_ERROR'
	})

export const saveNoteSuccess = (id, data) =>
	({
		type: 'SAVE_NOTE_SUCCESS',
		id: id,
		data: data
	})

export const saveNoteError = error =>
	({
		type: 'SAVE_NOTE_ERROR',
		error: error
	})



// Unsorted

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