import { useMatch } from 'react-router-dom'
import { push } from '@lagunovsky/redux-react-router'

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
	const path = location.pathname
	const pathID = regex.checkPathForID(path) ? regex.parseIDFromPath(path) : undefined		
	const pathNumber = regex.checkPathForNumber(path) ? regex.parseNumberFromPath(path) : undefined
	switch(action.type) {
		case '@@router/ON_LOCATION_CHANGED':
			// If a docType can be parsed from the path, set it
			console.log(path)
			console.log('docType regex:', regex.checkIfDocTypePath(path))
			console.log('editbaseroute regex:', regex.checkEditBaseRoute(path))
			console.log('checkIfRedirectPath regex:', regex.checkEditBaseRoute(path))
			if (regex.checkIfDocTypePath(path)) {
				console.log('THIS WORKS')
				store.dispatch(actions.setDocType(regex.parseDocTypeFromPath(path)))
			}
			// If path is /edit and docType isn't chapters, redirect to the docType to the path
			if (regex.checkEditBaseRoute(path)){
				if (docType !== 'chapters') {
					store.dispatch(push('/edit'))
				}
			}
			// If path ends in :id...
			if (regex.checkIfRedirectPath(path)) {
				// And path is /:id or /edit/:id and chapters are loaded, set currentDocument to first chapter
				if (regex.checkIfRootPath(path) && chapters.length > 0) {
					store.dispatch(actions.setCurrentDocument(chapters[0].id, 'chapters'))
				}
				// And path is /edit/:id and chapters are loaded, set currentDocument to first chapter
				else if (regex.checkEditRoute(path) && !regex.checkIfDocTypePath(path) && chapters.length > 0) {
					store.dispatch(actions.setCurrentDocument(chapters[0].id, 'chapters'))
				}
				// And path has a docType and docs are loaded, set currentDocument to first doc of that type
				else if (regex.checkIfDocTypePath(path)) {
					switch(regex.parseDocTypeFromPath(path)) {
						case 'notes':
							if (notes.length > 0) {
								store.dispatch(actions.setCurrentDocument(notes[0].id, 'notes'))
							}
							break
						case 'tags':
							if (tags.length > 0) {
								store.dispatch(actions.setCurrentDocument(tags[0].id, 'tags'))
							}
							break
						case 'media':
							if (media.length > 0) {
								store.dispatch(actions.setCurrentDocument(media[0].id, 'media'))
							}
							break
						default:
							break
					}
				}
				// If the above conditions aren't met and currentDocument is set, redirect to the right identifier
				else if (currentDocument.hasOwnProperty('id')) {
					const routeID = docType === 'chapters' ? String(currentDocument.number) : currentDocument.id
					store.dispatch(push(routeID))
				}
			}
		case 'GET_DOCUMENT_LIST':
			// If no currentDocument is set, set one after receiving the list of docs
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
			// matchPath('edit', path)
			if (regex.checkEditRoute(path)) {
				if (action.docType === 'chapters') {			
					store.dispatch(push('/edit'))
				} else {
					const docTypeEditPath = '/edit/' + action.docType;
					store.dispatch(push(docTypeEditPath))
				}
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				// After successfully retrieving a currentDocument, redirect to its identifier to the path
				const documentPath = action.docType === 'chapters' ? String(action.data.number) : action.data.id
				store.dispatch(push(documentPath))
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