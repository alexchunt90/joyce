import axios from 'axios'
import { stateToHTML } from 'draft-js-export-html'
import { stateToMarkdown } from 'draft-js-export-markdown'
import { convertToRaw } from 'draft-js'
import { push } from 'react-router-redux'

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

// const selectChapterIDByNumber = (store, number) => {
// 	for (const chapter of store.getState().chapters) {
// 		if (number === chapter.number) {
// 			return chapter.id
// 		}
// 	}
// }

const parseNumberFromPath = path => {
	const match = /\/([0-9]*)$/.exec(path)
	if (match && parseInt(match[1])) {
		return Number(match[1])
	} else {
		return null
	}
}

const parseIDFromPath = path => {
	const match = /\/([A-Za-z0-9\-\_]{18,})$/.exec(path)
	if (match) {
		return match[1]
	} else {
		return null
	}
}

const checkIfRedirectPath = path => {
	const match = /\/(\:id)$/.exec(path)
	if (match) {
		return true
	} else {
		return false
	}
}

const selectDocumentIDByPath = (path, docs, docType) => {
	if (docType === 'chapters') {
		const number = parseNumberFromPath(path)
		for (const chapter of docs) {
			if (chapter.number === number) {return chapter.id}
		}
	} else {
		const id = parseIDFromPath(path)
		for (const doc of docs) {
			if (doc.id === id) {return doc.id}
		}
	}
}

const selectDocTypeIdentifier = (doc, docType) => {
	if (docType === 'chapters') {
		return String(doc.number)
	} else {
		return doc.id
	}
}

// API Middleware
export const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		case '@@router/LOCATION_CHANGE':
			if (checkIfRedirectPath(action.payload.pathname) || action.payload.pathname === '/') {
				if (store.getState().currentDocument.id) {
					const id = selectDocTypeIdentifier(store.getState().currentDocument, store.getState().docType)
					store.dispatch(push(id))
				}
			}
			break
		// API Calls
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				HTTPGetDocumentList(action.docType, action.state).then(response =>
					store.dispatch(getDocumentList(response))
				)
			}
			if (action.status === 'success' && action.docType === store.getState().docType && !store.getState().currentDocument.id) {
				const path = store.getState().routerReducer.location.pathname
				if (checkIfRedirectPath(path)) {
					store.dispatch(setCurrentDocument(action.data[0].id, action.docType))
				} else {
					const id = selectDocumentIDByPath(path, action.data, action.docType)
					store.dispatch(setCurrentDocument(id, action.docType))
				}
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(getDocumentText(response))
				)
			}
			if (action.status === 'success' && action.state === 'currentDocument') {
				if (action.docType === 'chapters') {
					store.dispatch(push(String(action.data.number)))
				} else  if (action.docType === 'notes') {
					store.dispatch(push(action.data.id))
				}
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
		default:
			break
	}
}