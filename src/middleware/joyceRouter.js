import { push } from 'react-router-redux'

import actions from '../actions'
import helpers from '../modules/helpers'
import regex from '../modules/regex'

const joyceRouter = store => next => action => {
	next(action)
	// State
	const chapters = store.getState().chapters
	const notes = store.getState().notes
	const tags = store.getState().tags
	const media = store.getState().media
	const currentDocument = store.getState().currentDocument
	const docType = store.getState().docType
	// Path
	const path = store.getState().routerReducer.location !== null ? store.getState().routerReducer.location.pathname : '/'
	const pathID = regex.checkPathForID(path) ? regex.parseIDFromPath(path) : undefined		
	const pathNumber = regex.checkPathForNumber(path) ? regex.parseNumberFromPath(path) : undefined
	switch(action.type) {
		case '@@router/LOCATION_CHANGE':
			// If a docType can be parsed from the path, set it
			if (regex.checkIfDocTypePath(path)) {
				store.dispatch(actions.setDocType(regex.parseDocTypeFromPath(path)))
			}
			// If path is /edit and docType isn't chapters, push the docType to the path
			if (regex.checkEditBaseRoute(path)){
				if (docType !== 'chapters') {
					store.dispatch(push('/edit/' + docType))
				}
			}
			// If path ends in :id...
			if (regex.checkIfRedirectPath(path)) {
				// And currentDocument is set, push the right identifier
				if (currentDocument.hasOwnProperty('id')) {
					store.dispatch(push(docType === 'chapters' ? String(currentDocument.number) : currentDocument.id))	
				}
				// And path is /:id or /edit/:id and chapters are loaded, set currentDocument to first chapter
				else if (regex.checkIfRootPath(path) && chapters.length > 0) {
						store.dispatch(actions.setCurrentDocument(chapters[0].id, 'chapters'))
				}
				else if (regex.checkEditRoute(path) && !checkIfDocTypePath(path) && chapters.length > 0 ) {
					store.dispatch(actions.setCurrentDocument(chapters[0].id, 'chapters'))
				}
				// And path has a docType and docs are loaded, set currentDocument to first doc of that type
				else if (regex.checkIfDocTypePath(path)) {
					switch(regex.parseDocTypeFromPath) {
						case 'notes':
							if (notes.length > 0) {
								store.dispatch(actions.setCurrentDocument(notes[0].id, 'notes'))
							}
						case 'tags':
							if (tags.length > 0) {
								store.dispatch(actions.setCurrentDocument(tags[0].id, 'tags'))
							}
						case 'media':
							if (media.length > 0) {
								store.dispatch(actions.setCurrentDocument(media[0].id, 'media'))
							}
						default:
							break
					}
				}
			}
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'success' && action.docType === docType && !currentDocument.id) {
				// If path ends in :id, set currentDocument to the first from the returned list
				if (regex.checkIfRedirectPath(path) && action.data.length > 0) {
					store.dispatch(actions.setCurrentDocument(action.data[0].id, action.docType))
				}
				// If docType is chapters and path ends in a number, find chapter matching that number and set its ID to currentDocument
				if (action.docType === 'chapters' && pathNumber !== undefined) {
					for (const chapter of action.data) {
						if (chapter.number === pathNumber) {
							store.dispatch(actions.setCurrentDocument(chapter.id, action.docType))
						}
					}
				// If path ends in an ID, set it to the currentDocument
				} else if (pathID !== undefined) {
					store.dispatch(actions.setCurrentDocument(pathID, action.docType))
				}				
			}
			break
		case 'SET_EDITOR_DOC_TYPE':
			// If path starts with /edit, set the path appropriate for the docType
			if (regex.checkEditRoute(path)) {
				if (action.docType === 'chapters') {			
					store.dispatch(push('/edit'))
				} else {
					store.dispatch(push('/edit/' + action.docType))
				}
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				// After successfully retrieving a currentDocument, push its identifier to the path
				store.dispatch(push(action.docType === 'chapters' ? String(action.data.number) : action.data.id))
			}
			break
		case 'SAVE_DOCUMENT':
			// If successfully saving a new document, load it by pulling the id from the last document in the list
			if (action.status === 'success' && !action.id) {
				store.dispatch(actions.setCurrentDocument(action.data.slice(-1)[0].id, action.docType))
			}
			// If successfully saving an existing document, reload the current document
			if (action.status ==='success' && action.id) {
				store.dispatch(actions.setCurrentDocument(currentDocument.id, action.docType))
			}
			break			
		case 'DELETE_DOCUMENT':
			if (action.status === 'success' && action.data[0]) {
				store.dispatch(actions.setCurrentDocument(action.data[0].id, action.docType, 'currentDocument'))
			}
			break			
		default:
			break
	}
}

export default joyceRouter