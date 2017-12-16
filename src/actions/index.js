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
		state: response.state,
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
		id: response.id ? response.id : null,
		docType: response.docType,
		status: response.status ? response.status : 'request',
		data: response.data
	})

export const editTextReceived = data =>
	({
		type: 'UPDATE_EDITED_CHAPTER',
		data: data
	})
	
// Document Actions

	export const setCurrentDocument = (id, docType) =>
		({
			type: 'SET_CURRENT_DOCUMENT',
			id: id,
			docType: docType
		})	

	export const createNewDocument = docType =>
		({
			type: 'CREATE_DOCUMENT',
			docType: docType
		})	

	export const submitDocumentEdit = (currentDocument, editorState, documentTitleInput, docType) =>
		({
			type: 'SUBMIT_DOCUMENT_EDIT',
			currentDocument: currentDocument,
			editorState: editorState,
			documentTitleInput: documentTitleInput,
			docType: docType
		})

	export const deleteCurrentDocument = (id, docType) =>
		({
			type: 'DELETE_CURRENT_DOCUMENT',
			id: id,
			docType: docType

		})

// Mode Actions

	export const setMode = mode =>
		({
			type: 'SET_MODE',
			mode: mode
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

	export const applyInlineStyles = (editorState, style) =>
		({
			type: 'APPLY_INLINE_STYLE',
			editorState: editorState,
			style: style
		})

	export const handleEditorKeyCommand = (editorState, command) =>
		({
			type: 'HANDLE_EDITOR_KEY_COMMAND',
			editorState: editorState,
			command: command
		})

// Note Highlight Actions

	export const toggleHighlight = () =>
		({
			type: 'TOGGLE_HIGHLIGHT'
		})

	export const updateDocumentTitleChange = documentTitleInput => {
		return ({
			type: 'UPDATE_DOCUMENT_TITLE',
			data: documentTitleInput.target.value
		})
	}

// DocType Actions

	export const setDocType = docType =>
		({
			type: 'SET_DOC_TYPE',
			docType: docType
		})

// Annotation Actions

	export const addAnnotation = data =>
		({
			type: 'ADD_ANNOTATION',
			data: data
		})

	export const submitAnnotation = (annotationNote, selectionState, editorState) =>
		({
			type: 'SUBMIT_ANNOTATION',
			annotationNote: annotationNote,
			selectionState: selectionState,
			editorState: editorState
		})

	export const removeAnnotation = (editorState) =>
		({
			type: 'REMOVE_ANNOTATION',
			editorState: editorState,	
			selectionState: editorState.getSelection()
		})

	export const selectAnnotationNote = id =>
		({
			type: 'SELECT_ANNOTATION_NOTE',
			id: id
		})

// Search

	export const updateSearchInput = searchInput => {
		return ({
			type: 'UPDATE_SEARCH_INPUT',
			data: searchInput.target.value
		})		
	}