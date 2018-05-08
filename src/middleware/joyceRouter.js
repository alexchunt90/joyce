import { push } from 'react-router-redux'

import { setCurrentDocument, setDocType } from '../actions/userActions'
import helpers from '../modules/helpers'
import regex from '../modules/regex'

const joyceRouter = store => next => action => {
	next(action)
	const path = store.getState().routerReducer.location !== null ? store.getState().routerReducer.location.pathname : '/'
	const pathID = regex.checkPathForID(path) ? regex.parseIDFromPath(path) : undefined		
	const pathNumber = regex.checkPathForNumber(path) ? regex.parseNumberFromPath(path) : undefined
	const docType = store.getState().docType
	const currentDocument = store.getState().currentDocument
	const chapters = store.getState().chapters
	const notes = store.getState().notes
	switch(action.type) {
		case '@@router/LOCATION_CHANGE':
			if (regex.checkIfRedirectPath(path) && currentDocument.hasOwnProperty('id')) {
				store.dispatch(push(docType === 'chapters' ? String(currentDocument.number) : currentDocument.id))
			}
			if (regex.checkNoteReaderRoute(path) && regex.checkIfRedirectPath(path) && notes.length > 0) {
				store.dispatch(setCurrentDocument(notes[0].id, 'notes'))
			}
			if (regex.checkNoteReaderRoute(path) || regex.checkNoteEditorRoute(path)) {
				store.dispatch(setDocType('notes'))
			}
			if (regex.checkRootRedirectRoute(path) && chapters.length > 0) {
				store.dispatch(setCurrentDocument(chapters[0].id, 'chapters'))
			}
			if (regex.checkNoteBaseRoute(path)) {
				store.dispatch(setDocType('notes'))
			}
			if (regex.checkEditBaseRoute(path)){
				if (docType === 'notes') {
					store.dispatch(push('/edit/notes'))
				}
			}
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'success' && action.docType === docType && !currentDocument.id) {
				if (regex.checkIfRedirectPath(path)) {
					store.dispatch(setCurrentDocument(action.data[0].id, action.docType))
				}
				if (action.docType === 'chapters' && pathNumber !== undefined) {
					for (const chapter of action.data) {
						if (chapter.number === pathNumber) {
							store.dispatch(setCurrentDocument(chapter.id, action.docType))
						}
					}
				} else if (pathID !== undefined) {
					store.dispatch(setCurrentDocument(pathID, action.docType))
				}				
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success') {
				store.dispatch(push(action.docType === 'chapters' ? String(action.data.number) : action.data.id))
			}
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'success' && !action.id) {
				store.dispatch(setCurrentDocument(action.data.slice(-1)[0].id, action.docType))
			}
			break			
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				api.HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(deleteDocument(response))
				)
			} else if (action.status === 'success') {
				if (action.data[0]) {
					store.dispatch(setCurrentDocument(action.data[0].id, action.docType, 'currentDocument'))
				}
			}
			break			
		default:
			break
	}
}

export default joyceRouter