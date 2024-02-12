import { useMatch } from 'react-router-dom'
import { push } from '@lagunovsky/redux-react-router'

import {returnEditorStateWithSearchTextFocus } from '../modules/editorSettings'
import actions from '../actions'
import helpers from '../modules/helpers'
import regex from '../modules/regex'

const joyceRouter = store => next => action => {
	// State
	const chapters = store.getState().chapters
	const notes = store.getState().notes
	const tags = store.getState().tags
	const media = store.getState().media
	const currentDocument = store.getState().currentDocument
	const currentBlock = store.getState().currentBlock
	const docType = store.getState().docType
	// Path
	const path = location.pathname
	const hash = location.hash.slice(1) || undefined
	const pathID = regex.checkPathForID(path) ? regex.parseIDFromPath(path) : undefined		
	const pathNumber = regex.checkPathForNumber(path) ? regex.parseNumberFromPath(path) : undefined

	switch(action.type) {
		case '@@router/ON_LOCATION_CHANGED':
			// If you navigate to /edit while docType=notes, redirect to /edit/notes
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
			// If routing to reader for a new chapter, set new currentDocument
			if (regex.checkIfRootPathWithNumber(path)) {
				for (const chapter of chapters) {
					if (chapter.number === pathNumber && chapter.id !== currentDocument.id) {
						if (docType !== 'chapters') {
							store.dispatch(actions.setDocType('chapters'))
						}
						store.dispatch(actions.setCurrentDocument(chapter.id, 'chapters'))
					}
				}
			}
			// If routing to reader for other docTypes, set new currentDocument
			if (regex.checkIfRootPathWithID(path)) {
				const pathDocType = parseDocTypeFromPath(path)
				if (docType !== pathDocType) {
					store.dispatch(setDocType(pathDocType))
				}
				if (pathID !== currentDocument.id) {
					store.dispatch(setCurrentDocument(pathId, pathDocType))
				}
			}
			// If a docType can be parsed from the path, set it
			if (regex.checkIfDocTypePath(path)) {
				store.dispatch(actions.setDocType(regex.parseDocTypeFromPath(path)))
			}
			// if (typeof hash !== 'undefined') {
			// 	store.dispatch(actions.setCurrentBlock(currentDocument.id, hash))
			// }

			break
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
				const actionIdentifier = action.docType === 'chapters' ? String(action.data.number) : action.data.id
				const pathIdentifier = action.docType === 'chapters' ? String(pathNumber) : pathID
				if (actionIdentifier !== pathIdentifier) {
					store.dispatch(push(actionIdentifier))
				}
				if (actionIdentifier === pathIdentifier && typeof hash !== 'undefined') {
					store.dispatch(actions.setCurrentBlock(action.data.id, hash))
				}				
				// If this is a different document than the one referenced by currentBlock, unset currentBlock
				if (typeof(currentBlock.id) !== 'undefined' && currentBlock.id !== action.data.id) {
					store.dispatch(actions.unsetCurrentBlock())
				}

			}
			break
		case 'SET_EDITOR_STATE':
			// When the reader loads a new document, if a currentBlock is set, jump to it
			if (typeof(currentBlock.id) !== 'undefined' && currentBlock.id === currentDocument.id ) {
				const newEditorState = returnEditorStateWithSearchTextFocus(action.data, currentBlock.key)
				console.log('Equality check', action.data === newEditorState)
				action.data = newEditorState
			}
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
	next(action)
}

export default joyceRouter