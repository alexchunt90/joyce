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
	submitDocumentEdit: (currentDocument, editorState, inputs, docType) =>
		({
			type: 'SUBMIT_DOCUMENT_EDIT',
			currentDocument: currentDocument,
			editorState: editorState,
			inputs: inputs,
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
	// Toggle the navbar dropdown on smaller screens
	toggleNavCollapse: () =>
		({
			type: 'TOGGLE_NAV_COLLAPSE'
		}),		
	// Toggle the button to hide or display note highlights
	toggleHighlight: () =>
		({
			type: 'TOGGLE_HIGHLIGHT'
		}),
	// Toggle the pagination mode in chapter reader
	togglePagination: () =>
		({
			type: 'TOGGLE_PAGINATION'
		}),
	choosePaginationEdition: edition =>
		({
			type: 'CHOOSE_PAGINATION_EDITION',
			data: edition
		}),
	setPaginationEdition: edition =>
		({
			type: 'SET_PAGINATION_EDITION',
			data: edition
		}),
	addPaginatedDoc: doc =>
		({
			type: 'ADD_PAGINATED_DOCUMENT',
			data: doc
		}),
	changePaginatedDoc: edition =>
		({
			type: 'CHANGE_PAGINATED_DOCUMENT',
			data: edition
		}),
	setPageNumber: number =>
		({
			type: 'CHANGE_SELECTED_PAGE',
			data: number
		}),
	createPageBreak: (pageNumber, year, selectionState) =>
		({
			type: 'SUBMIT_NEW_PAGE_BREAK',
			pageNumber: pageNumber,
			year: year,
			selectionState: selectionState
		}),
	// Select 'Read', 'Edit' or 'Annotate' modes in the Editor
	setMode: mode =>
		({
			type: 'SET_MODE',
			mode: mode
		}),
	// Toggle a checkbox for the doctypes to include in search results
	toggleSearchDocType: docType =>
		({
			type: 'TOGGLE_SEARCH_DOCTYPE',
			docType: docType
		}),
	onResultCountDropdownClick: count =>
		({
			type: 'UPDATE_SEARCH_RESULT_COUNT',
			count: count
		}),
	// Click 'Search' to request search results
	clickSearch: (searchInput, docTypes, resultCount) =>
		({
			type: 'CLICK_SEARCH',
			searchInput: searchInput,
			docTypes: docTypes,
			resultCount: resultCount
		}),
	// Click 'Search' to request search results
	setCurrentBlock: (id, key) =>
		({
			type: 'SET_CURRENT_BLOCK',
			id: id,
			key: key,
		}),
	unsetCurrentBlock: () =>
		({
			type: 'UNSET_CURRENT_BLOCK',
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
	submitExternalURL: (externalURL, editorState) =>
		({
			type: 'SUBMIT_EXTERNAL_URL',
			externalURL: externalURL,
			editorState: editorState			
		}),
	// Click 'Submit' to save annotation
	submitAnnotation: (annotationNote, annotationTag, selectionState, editorState, docType) =>
		({
			type: 'SUBMIT_ANNOTATION',
			annotationNote: annotationNote,
			annotationTag: annotationTag,
			selectionState: selectionState,
			editorState: editorState,
			docType: docType
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
	showAdmin: () =>
		({
			type: 'SHOW_ADMIN_HEADER'
		}),
	hideAdmin: () =>
		({
			type: 'HIDE_ADMIN_HEADER'
		}),
	// Media
	clearLoadedMedia: () =>
		({
			type: 'CLEAR_LOADED_MEDIA'
		}),
	// Admin Google Login
	consentSuccess: response =>
		({
			type: 'OAUTH_CONSENT_SUCCESS',
			credential: response.credential
		}),
	googleTokenAuthorization: response =>
		({
			type: 'OAUTH_TOKEN_AUTHORIZATION',
			status: response.status,
			data: response.data.data
		}),
	userLogout: () =>
		({
			type: 'USER_LOGOUT_REQUEST'
		}),
	userLogoutResponse: (status) =>
		({
			type: 'USER_LOGOUT_RESPONSE',
			status: status
		}),
	resumeUserSession: (user_name) =>
		({
			type: 'USER_LOGIN_REFRESH',
			user_name: user_name
		})
}

export default userActions