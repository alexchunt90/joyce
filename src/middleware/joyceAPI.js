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

import { setCurrentDocument } from '../actions/userActions'

import { 
	HTTPGetDocumentList, 
	HTTPGetDocumentText, 
	HTTPDeleteDocument, 
	HTTPPutCreateDocument, 
	HTTPPostWriteDocument, 
	HTTPPostSearchResults } from './http.js'

import { getFirstDocument } from '../mixins/firstDocument'

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

const convertToPlainText = contentState => {
	const rawState = convertToRaw(contentState)
	return rawState.blocks.reduce(
	  (plaintText, block) => plaintText + block.text + '\n',
	  ''
	)	
}

const selectChapterIDByNumber = (store, number) => {
	for (const chapter of store.getState().chapters) {
		if (number === chapter.number) {
			return chapter.id
		}
	}	
}

const parseNumberFromPath = path => {
	const match = /\/([0-9]*)$/.exec(path)
	if (match) {
		if (parseInt(match[1])) {	
			const number = Number(match[1])
			return number
		} else {
			return null
		}
	} else {
		return null
	}
}

// API Middleware
export const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		// API Calls
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				HTTPGetDocumentList(action.docType, action.state).then(response =>
					store.dispatch(getDocumentList(response))
				)
			}
			if (action.status === 'success' && action.docType === store.getState().docType && !store.getState().currentDocument.id) {
				if (action.docType === 'chapters') {
					const pathNumber = parseNumberFromPath(store.getState().routerReducer.location.pathname)
					store.dispatch(setCurrentDocument(selectChapterIDByNumber(store, pathNumber), action.docType))
				} else if (action.docType === 'notes') {
					store.dispatch(setCurrentDocument(store.getState().notes[0].id, action.docType))
				}
			}			
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(getDocumentText(response))
				)
			}
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request') {
				if (action.id) {
					HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
					store.dispatch(saveDocument(response))
				)} else {
					HTTPPutCreateDocument(action.docType, action.data).then(response =>
					store.dispatch(saveDocument(response)))
				}
			} else if (action.status === 'success' && !action.id) {
				store.dispatch(setCurrentDocument(action.data.slice(-1)[0].id, action.docType))
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			} else if (action.status === 'success') {
				if (action.data[0]) {
					store.dispatch(setCurrentDocument(action.data[0].id, action.docType, 'currentDocument'))
				}
			}
			break
		// Document Action Middleware
		case 'SET_DOC_TYPE':
			const firstDocument = getFirstDocument(store, action.docType)
			if (firstDocument) {
				store.dispatch(getDocumentText({id: firstDocument.id, docType: action.docType, state: 'currentDocument'}))
			}
			break
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
		// Annotation Action Middleware
		case 'SELECT_ANNOTATION_NOTE':
			store.dispatch(getDocumentText({id: action.id, docType: 'notes', state: 'annotationNote'}))
			break
		// Search Action Middleware
		case 'CLICK_SEARCH':
			store.dispatch(getSearchResults({data: action.data}))
			break
		case 'GET_SEARCH_RESULTS':
			if (action.status === 'request') {
				HTTPPostSearchResults(action.data).then(response =>
					store.dispatch(getSearchResults(response))
				)
			}
			break
		case '@@router/LOCATION_CHANGE':
			const pathNumber = parseNumberFromPath(action.payload.pathname)
			if (pathNumber) {
				for (const chapter of store.getState().chapters) {
					if (pathNumber === chapter.number) {
						store.dispatch(setCurrentDocument(chapter.id, 'chapters'))
					}
				}
			}
		default:
			break
	}
}