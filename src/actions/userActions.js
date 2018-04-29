//
// User Actions
//
	// These actions are initiated by user action
	
	// Select a document to read or edit
	export const setCurrentDocument = (id, docType) =>
		({
			type: 'SET_CURRENT_DOCUMENT',
			id: id,
			docType: docType
		})

	// Click the 'New' button in the Editor
	export const createNewDocument = docType =>
		({
			type: 'CREATE_DOCUMENT',
			docType: docType
		})	

	// Click 'Submit' to save a document edit
	export const submitDocumentEdit = (currentDocument, editorState, documentTitleInput, docType) =>
		({
			type: 'SUBMIT_DOCUMENT_EDIT',
			currentDocument: currentDocument,
			editorState: editorState,
			documentTitleInput: documentTitleInput,
			docType: docType
		})

	// Click 'Cancel' to discard document changes
	export const cancelEdit = () =>
		({
			type: 'CANCEL_EDIT'
		})

	// Click 'Delete' and confirm to delete a document
	export const deleteCurrentDocument = (id, docType) =>
		({
			type: 'DELETE_CURRENT_DOCUMENT',
			id: id,
			docType: docType

		})

	// Toggle the button to hide or display note highlights
	export const toggleHighlight = () => {
		return ({
			type: 'TOGGLE_HIGHLIGHT'
		})
	}
	
	// Select 'Read', 'Edit' or 'Annotate' modes in the Editor
	export const setMode = mode =>
		({
			type: 'SET_MODE',
			mode: mode
		})

	// Click 'Search' to request search results
	export const clickSearch = searchInput => {
		return ({
			type: 'CLICK_SEARCH',
			data: searchInput
		})
	}

	// Set the DocType to choose from in the Editor
	export const setDocType = docType =>
		({
			type: 'SET_DOC_TYPE',
			docType: docType
		})

	// Click 'Add Annotation' to enter 'Annotate' mode
	export const addAnnotation = data =>
		({
			type: 'ADD_ANNOTATION',
			data: data
		})

	// Click 'Submit' to save annotation
	export const submitAnnotation = (annotationNote, selectionState, editorState) =>
		({
			type: 'SUBMIT_ANNOTATION',
			annotationNote: annotationNote,
			selectionState: selectionState,
			editorState: editorState
		})

	// Click to remove selected Annotation
	export const removeAnnotation = (editorState) =>
		({
			type: 'REMOVE_ANNOTATION',
			editorState: editorState,	
			selectionState: editorState.getSelection()
		})

	// Click a link to choose the note that will be displayed in the modal
	export const selectAnnotationNote = id =>
		({
			type: 'SELECT_ANNOTATION_NOTE',
			id: id
		})