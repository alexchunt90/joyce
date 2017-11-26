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
		id: response.id,
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const editTextReceived = data =>
	({
		type: 'UPDATE_EDITED_CHAPTER',
		data: data
	})

// User Actions
	
	// Reader
	export const toggleHighlight = () =>
		({
			type: 'TOGGLE_HIGHLIGHT'
		})

	export const setChapterToRead = id =>
		({
			type: 'SET_READ_CHAPTER',
			id: id
		})

	// Editor
	export const createNewChapter = (chapterNumber = null) =>
		({
			type: 'CREATE_CHAPTER',
			chapterNumber: chapterNumber

		})	

	export const setChapterToEdit = id =>
		({
			type: 'SET_EDITED_CHAPTER',
			id: id
		})

	export const updateEditorState = editorState =>
		({
			type: 'UPDATE_EDITOR_STATE',
			data: editorState
		})

	export const updateChapterTitleInput = chapterTitleInput => {
		return ({
			type: 'UPDATE_CHAPTER_TITLE',
			data: chapterTitleInput.target.value
		})
	}	

	export const submitChapterEdit = document =>
		({
			type: 'SUBMIT_CHAPTER_EDIT',
			document: document
		})

	export const deleteCurrentChapter = id =>
		({
			type: 'DELETE_CURRENT_CHAPTER',
			id: id
		})