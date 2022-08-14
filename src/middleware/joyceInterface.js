import actions from '../actions'
import api from '../modules/api'
import helpers from '../modules/helpers'
import { validateSubmittedDocument, validateSubmittedAnnotation } from '../modules/validation'
import { stateToHTML, convertToSearchText, linkDecorator, returnEditorStateWithNewAnnotation } from '../modules/editorSettings.js'

const joyceInterface = store => next => action => {
	next(action)
	const chapters = store.getState().chapters
	const notes = store.getState().notes
	const tags = store.getState().tags
	const media = store.getState().media
	const docType = store.getState().docType
	const docs = helpers.documentsOfDocType(docType, chapters, notes, tags, media)
	switch(action.type) {
		case 'SET_CURRENT_DOCUMENT':
			store.dispatch(actions.getDocumentText({id: action.id, docType: action.docType, state: 'currentDocument'}))
			break
	// Submitting document edits
		case 'SUBMIT_DOCUMENT_EDIT':
			// Check for validation errors
			const docErrors = validateSubmittedDocument(action.docType, action.inputs, action.currentDocument)
			if (docErrors.length < 1) {
				const textContent = action.editorState.getCurrentContent()
				// Convert state to HTML and search text to be posted to Elasticsearch
				const data = { 
					title: action.inputs.documentTitle, 
					html_source: stateToHTML(textContent), 
					search_text: convertToSearchText(textContent),
				}
				if (action.docType === 'notes') {
					data.media_doc_ids = action.inputs.noteMediaSelection
				}
				if (action.docType === 'tags') {
					data.color = action.inputs.colorPicker
				}
				if (action.docType === 'media') {
					data.uploadFile = action.inputs.uploadFile
				}				
				// Documents that haven't yet been indexed in ES will have undefined id
				if (action.currentDocument.id) {
					data.id = action.currentDocument.id
				}
				if (action.docType === 'chapters') {
					// If user submits a chapter with no assigned id, generate the next number to assign it
					if (!action.currentDocument.id) {
						const nextNumber = store.getState().chapters.length + 1
						data.number = nextNumber
					} else {
						data.number = action.currentDocument.number
					} 
				}
				store.dispatch(actions.saveDocument({id: data.id ? data.id : null, docType: action.docType, data: data}))
			}
			break
		case 'DELETE_CURRENT_DOCUMENT':
			store.dispatch(actions.deleteDocument({id: action.id, docType: action.docType}))
			break
		case 'CANCEL_EDIT':
			const docType = store.getState().docType
			const currentDocument = store.getState().currentDocument
			if (currentDocument.id) {
				store.dispatch(actions.getDocumentText({id: currentDocument.id, docType: docType, state: 'currentDocument'}))
			} else {
				store.dispatch(actions.getDocumentText({id: docs[0].id, docType: docType, state: 'currentDocument'}))
			}
			break
		case 'SET_DOC_TYPE':
			if (action.docType !== store.getState().docType) {
				store.dispatch(actions.clearCurrentDocument())
			}
			break
	// Annotation Action Middleware
		case 'SELECT_ANNOTATION_NOTE':
			store.dispatch(actions.getDocumentText({id: action.id, docType: 'notes', state: 'annotationNote'}))
			break
		// 
		case 'GET_DOCUMENT_TEXT':
			// Upon successfully retrieving a annotationNote to display, retrieve details for associated media
			if (action.status === 'success' && action.docType === 'notes' && action.state === 'annotationNote') {
				if (action.data.media_doc_ids.length > 0) {
					store.dispatch(actions.getMediaDocs({media_doc_ids: action.data.media_doc_ids}))
				}
			}
			break			
		case 'SUBMIT_ANNOTATION':
			const annotationErrors = validateSubmittedAnnotation(action.annotationNote, action.annotationTag)
			if (annotationErrors.length < 1) {
				const contentState = action.editorState.getCurrentContent()
				const newEditorState = returnEditorStateWithNewAnnotation(contentState, action)
				store.dispatch(actions.annotationCreated(newEditorState))
				document.getElementById('select_annotation_modal_close').click()
			}
			break
	// Search Action Middleware
		case 'CLICK_SEARCH':
			store.dispatch(actions.getSearchResults({data: action.data}))
			break		
		default:
			break
	}
}

export default joyceInterface