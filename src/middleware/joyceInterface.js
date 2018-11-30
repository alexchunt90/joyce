import axios from 'axios'
import { EditorState, Modifier } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import actions from '../actions'
import helpers from '../modules/helpers'
import { validateSubmittedDocument, validateSubmittedAnnotation } from '../modules/validation'
import { html_export_options, convertToSearchText, linkDecorator } from '../modules/editorSettings.js'

const joyceInterface = store => next => action => {
	next(action)
	switch(action.type) {
		case 'SET_CURRENT_DOCUMENT':
			store.dispatch(actions.getDocumentText({id: action.id, docType: action.docType, state: 'currentDocument'}))
			break
		case 'SUBMIT_DOCUMENT_EDIT':
			const docErrors = validateSubmittedDocument(action.docType, action.inputs)
			if (docErrors.length < 1) {
				const textContent = action.editorState.getCurrentContent()
				const data = { 
					title: action.documentTitleInput, 
					html_source: stateToHTML(textContent, html_export_options), 
					search_text: convertToSearchText(textContent) 
				}
				if (action.docType === 'tags') {
					data.color = action.colorPickerInput
				}
				if (action.currentDocument.id) {
					data.id = action.currentDocument.id
				}
				if (action.docType === 'chapters') {
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
				store.dispatch(actions.getDocumentText({id: notes[0].id, docType: docType, state: 'currentDocument'}))
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
		case 'SUBMIT_ANNOTATION':
			const annotationErrors = validateSubmittedAnnotation(action.annotationNote, action.annotationTag)
			if (annotationErrors.length < 1) {
				const contentState = action.editorState.getCurrentContent()
				const contentStateWithEntity = contentState.createEntity(
	  				'LINK',
	  				'MUTABLE',
	  				{'url': action.annotationNote.id, 'data-color': action.annotationTag.color, 'data-tag': action.annotationTag.title}
				)
				const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
				const contentStateWithLink = Modifier.applyEntity(
	  				contentStateWithEntity,
	  				action.selectionState,
	  				entityKey
				)
				const newEditorState = EditorState.createWithContent(contentStateWithLink, linkDecorator)
				store.dispatch(actions.annotationCreated(newEditorState))
				// This feels like a hacky way of closing the modal only after validating input
				// But seemed more idiomatic than writing jQuery
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