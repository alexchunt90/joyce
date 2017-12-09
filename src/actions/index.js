// API Request Actions

export const getDocumentList = (response = {}) =>
	({
		type: 'GET_DOCUMENT_LIST',
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const getDocumentText = (response = {}) =>
	({
		type: 'GET_DOCUMENT_TEXT',
		id: response.id,
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const deleteDocument = (response = {}) =>
	({
		type: 'DELETE_DOCUMENT',
		id: response.id,
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const saveDocument = (response = {}) =>
	({
		type: 'SAVE_DOCUMENT',
		id: response.data.id ? response.data.id : null,
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const editTextReceived = data =>
	({
		type: 'UPDATE_EDITED_CHAPTER',
		data: data
	})
	
// Chapter Actions

	export const setCurrentChapter = id =>
		({
			type: 'SET_CURRENT_CHAPTER',
			id: id
		})

	export const createNewChapter = () =>
		({
			type: 'CREATE_CHAPTER',
		})	

	export const submitChapterEdit = data =>
		({
			type: 'SUBMIT_CHAPTER_EDIT',
			document: data
		})

	export const deleteCurrentChapter = id =>
		({
			type: 'DELETE_CURRENT_CHAPTER',
			id: id
		})

// Note Actions

	export const setCurrentNote = id =>
		({
			type: 'SET_CURRENT_NOTE',
			id: id
		})

	export const createNewNote = () =>
		({
			type: 'CREATE_NOTE',
		})	

	export const submitNoteEdit = data =>
		({
			type: 'SUBMIT_NOTE_EDIT',
			document: data
		})

	export const deleteCurrentNote = id =>
		({
			type: 'DELETE_CURRENT_NOTE',
			id: id
		})

// Mode Actions

	export const setEditMode = () =>
		({
			type: 'SET_EDIT_MODE'
		})

	export const cancelEdit = () =>
		({
			type: 'CANCEL_EDIT'
		})

// EditorState Actions

	export const updateEditorState = editorState =>
		({
			type: 'UPDATE_EDITOR_STATE',
			data: editorState
		})

// ChapterTitleInput Actions
	export const updateChapterTitleInput = chapterTitleInput => {
		return ({
			type: 'UPDATE_CHAPTER_TITLE',
			data: chapterTitleInput.target.value
		})
	}	

// Note Highlight Actions

	export const toggleHighlight = () =>
		({
			type: 'TOGGLE_HIGHLIGHT'
		})

	export const updateNoteTitleInput = noteTitleInput => {
		return ({
			type: 'UPDATE_NOTE_TITLE',
			data: noteTitleInput.target.value
		})
	}		