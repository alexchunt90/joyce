// ------------
// User Actions
// ------------
// These actions are initiated by user action
	
const userActions = {
	// Select a document to read or edit
	setCurrentDocument: (id, docType) =>
		({
			type: 'SET_CURRENT_DOCUMENT',
			id: id,
			docType: docType
		}),
	// Click the 'New' button in the Editor
	createNewDocument: docType =>
		({
			type: 'CREATE_DOCUMENT',
			docType: docType
		}),
	// Click 'Submit' to save a document edit
	submitDocumentEdit: (currentDocument, editorState, documentTitleInput, colorPickerInput, docType) =>
		({
			type: 'SUBMIT_DOCUMENT_EDIT',
			currentDocument: currentDocument,
			editorState: editorState,
			documentTitleInput: documentTitleInput,
			colorPickerInput: colorPickerInput,
			docType: docType
		}),
	// Click 'Cancel' to discard document changes
	cancelEdit: () =>
		({
			type: 'CANCEL_EDIT'
		}),
	clearCurrentDocument: () =>
		({
			type: 'CLEAR_CURRENT_DOCUMENT'
		}),
	// Click 'Delete' and confirm to delete a document
	deleteCurrentDocument: (id, docType) =>
		({
			type: 'DELETE_CURRENT_DOCUMENT',
			id: id,
			docType: docType

		}),
	// Select a color swatch to assign to a tag
	selectColorSwatch: color =>
		({
			type: 'SELECT_COLOR_SWATCH',
			data: color
		}),
	// Toggle the button to hide or display note highlights
	toggleHighlight: () =>
		({
			type: 'TOGGLE_HIGHLIGHT'
		}),
	// Select 'Read', 'Edit' or 'Annotate' modes in the Editor
	setMode: mode =>
		({
			type: 'SET_MODE',
			mode: mode
		}),
	// Click 'Search' to request search results
	clickSearch: searchInput =>
		({
			type: 'CLICK_SEARCH',
			data: searchInput
		}),
	// Set the DocType to choose from in the Editor
	setDocType: docType =>
		({
			type: 'SET_DOC_TYPE',
			docType: docType
		}),
	setEditorDocType: docType =>
		({
			type: 'SET_EDITOR_DOC_TYPE',
			docType: docType
		}),		
	// Click 'Add Annotation' to enter 'Annotate' mode
	addAnnotation: data =>
		({
			type: 'ADD_ANNOTATION',
			data: data
		}),
	// Click 'Submit' to save annotation
	submitAnnotation: (annotationNote, annotationTag, selectionState, editorState) =>
		({
			type: 'SUBMIT_ANNOTATION',
			annotationNote: annotationNote,
			annotationTag: annotationTag,
			selectionState: selectionState,
			editorState: editorState
		}),
	// Click to remove selected Annotation
	removeAnnotation: (editorState) =>
		({
			type: 'REMOVE_ANNOTATION',
			editorState: editorState,	
			selectionState: editorState.getSelection()
		}),
	// Click a link to choose the note that will be displayed in the modal
	selectAnnotationNote: id =>
		({
			type: 'SELECT_ANNOTATION_NOTE',
			id: id
		}),
	// Select a tag from the drop down to go with your annotation
	selectAnnotationTag: tag =>
		({
			type: 'SET_ANNOTATION_TAG',
			data: tag
		}),
	clearAnnotationTag: () =>
		({
			type: 'CLEAR_ANNOTATION_TAG'
		}),
}

export default userActions