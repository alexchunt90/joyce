import axios from 'axios'
import { stateToHTML } from 'draft-js-export-html'
import { stateToMarkdown } from 'draft-js-export-markdown'
import { convertToRaw } from 'draft-js'

import { 
	getDocumentList,
	getDocumentText,
	deleteDocument,
	saveDocument,
	createNewChapter,
	getSearchResults
} from '../actions/apiActions'

import { clearCurrentDocument } from '../actions/userActions'

import helpers from '../modules/helpers'

const html_export_options = {
  entityStyleFn: (entity) => {
    const entityType = entity.get('type').toUpperCase()
    if (entityType === 'LINK') {
      const data = entity.getData()
      return {
        element: 'a',
        attributes: {
    		'href': data.url,
        	'data-target': '#annotation_modal',
        	'data-toggle': 'modal'
        }
      }
    }
  }
}

const joyceInterface = store => next => action => {
	next(action)
	switch(action.type) {
		case 'SET_CURRENT_DOCUMENT':
			store.dispatch(getDocumentText({id: action.id, docType: action.docType, state: 'currentDocument'}))
			break
		case 'SUBMIT_DOCUMENT_EDIT':
			const textContent = action.editorState.getCurrentContent()
			const data = { title: action.documentTitleInput, html_source: stateToHTML(textContent, html_export_options), plain_text: convertToPlainText(textContent) }
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
			store.dispatch(saveDocument({id: data.id ? data.id : null, docType: action.docType, data: data}))
			break
		case 'DELETE_CURRENT_DOCUMENT':
			store.dispatch(deleteDocument({id: action.id, docType: action.docType}))
			break
		case 'CANCEL_EDIT':
			const docType = store.getState().docType
			const currentDocument = store.getState().currentDocument
			if (currentDocument.id) {
				store.dispatch(getDocumentText({id: currentDocument.id, docType: docType, state: 'currentDocument'}))
			} else {
				store.dispatch(getDocumentText({id: notes[0].id, docType: docType, state: 'currentDocument'}))
			}
			break
		case 'SET_DOC_TYPE':
			if (action.docType !== store.getState().docType) {
				store.dispatch(clearCurrentDocument())
			}
			break
		// Annotation Action Middleware
		case 'SELECT_ANNOTATION_NOTE':
			store.dispatch(getDocumentText({id: action.id, docType: 'notes', state: 'annotationNote'}))
			break
		// Search Action Middleware
		case 'CLICK_SEARCH':
			store.dispatch(getSearchResults({data: action.data}))
			break
		default:
			break
	}
}

export default joyceInterface