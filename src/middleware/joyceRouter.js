import { useMatch } from 'react-router-dom'
import { push } from '@lagunovsky/redux-react-router'

import editorConstructor from '../modules/editorConstructor'
import actions from '../actions'
import helpers from '../modules/helpers'
import regex from '../modules/regex'
import annotationURL from '../modules/annotationURL'
import modalControl from '../modules/modalControl'
import {infoPageTitleConstants, exemptNotePaths} from '../config'

// Make the annotation modal agree with the ?note= param of the current URL.
// This is the single code path for a link click, Back/Forward and a deep link:
// the URL is the source of truth, and this brings the note/modal state in line with it.
const syncAnnotationModalWithURL = store => {
	const annotationNote = store.getState().annotationNote
	const noteParam = annotationURL.parseNoteParam()
	if (typeof noteParam !== 'undefined') {
		if (noteParam !== annotationNote.id) {
			store.dispatch(actions.selectAnnotationNote(noteParam))
		}
		if (!modalControl.isAnnotationModalOpen()) {
			modalControl.showAnnotationModal()
		}
	} else if (modalControl.isAnnotationModalOpen()) {
		modalControl.hideAnnotationModal()
		store.dispatch(actions.dismissAnnotationNote())
	}
}

const joyceRouter = store => next => action => {
	// State
	const chapters = store.getState().chapters
	const notes = store.getState().notes
	const info = store.getState().info
	const tags = store.getState().tags
	const media = store.getState().media
	const editorState = store.getState().editorState
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
			// The large lists are not loaded at boot (see src/joyce.js), so fetch them the
			// first time navigation reaches a route that reads them. Every link into those
			// routes is a react-router Link, so arriving there never reloads the page.
			if (helpers.notesListNeeded(path) && notes.length === 0) {
				store.dispatch(actions.getDocumentList({docType: 'notes'}))
			}
			if (helpers.mediaListNeeded(path) && media.length === 0) {
				store.dispatch(actions.getDocumentList({docType: 'media'}))
			}
			// If you navigate to /edit while e.g. docType=notes, redirect to /edit/notes
			if (regex.checkEditBaseRoute(path)){
				if (docType !== 'chapters') {
					const basePath = '/edit/' + docType + '/'
					if (currentDocument.hasOwnProperty('id')) {
						store.dispatch(push(annotationURL.carryNoteParam(basePath + currentDocument.id)))
					}
					else {
						store.dispatch(push(annotationURL.carryNoteParam(basePath + ':id')))
					}
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
						case 'info':
							if (info.length > 0) {
								store.dispatch(actions.setCurrentDocument(info[0].id, 'info'))
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
					store.dispatch(push(annotationURL.carryNoteParam(routeID)))
				}
			}
			// If routing to reader for a new chapter, set new currentDocument
			if (pathNumber) {
				for (const chapter of chapters) {
					if (chapter.number === pathNumber && chapter.id !== currentDocument.id) {
						if (docType !== 'chapters') {
							store.dispatch(actions.setDocType('chapters'))
						}
						store.dispatch(actions.setCurrentDocument(chapter.id, 'chapters'))
					}
				}
			}
			// If a docType can be parsed from the path, set it
			if (regex.checkIfDocTypePath(path)) {
				store.dispatch(actions.setDocType(regex.parseDocTypeFromPath(path)))
			}
			// If routing to reader for other docTypes, set new currentDocument
			if (regex.checkIfRootPathWithID(path) && regex.checkIfDocTypePath(path)) {
				const pathDocType = regex.parseDocTypeFromPath(path)
				if (docType !== pathDocType) {
					store.dispatch(actions.setDocType(pathDocType))
				}
				if (pathID !== currentDocument.id) {
					store.dispatch(actions.setCurrentDocument(pathID, pathDocType))
				}
			}
			if (typeof hash !== 'undefined') {
				store.dispatch(actions.setCurrentBlock(currentDocument.id, hash))
			}
			if (path.substring(0,12) === '/notes/tally') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.TALLY_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}
			}
			if (path.substring(0,12) === '/notes/index') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.NOTE_INDEX_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}
			}
			if (path.substring(0,12) === '/notes/about') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.ABOUT_NOTES_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}
			}
			if (path.substring(0,12) === '/notes/color') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.COLOR_CODING_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}
			}
			if (path.substring(0,14) === '/notes/sources') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.SOURCES_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}				
			}
			if (path.substring(0,19) === '/notes/contributors') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.CONTRIBUTOR_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}				
			}
			if (path.substring(0,11) === '/notes/news') {
				for (const info_page of info) {
					if (info_page.title === infoPageTitleConstants.NEWS_INFO_PAGE_TITLE) {
						store.dispatch(actions.setCurrentDocument(info_page.id, 'info'))
					}
				}				
			}
			// Last, so it never runs against a path one of the redirects above is replacing.
			// Opens/loads/closes the annotation modal to match ?note= (click, Back/Forward, deep link).
			syncAnnotationModalWithURL(store)
			break
		case 'OPEN_ANNOTATION_NOTE':
			// A note link click becomes a history entry; ON_LOCATION_CHANGED does the loading.
			// Guard: re-clicking the note that is already in the URL must not stack entries.
			if (annotationURL.parseNoteParam() !== action.id) {
				store.dispatch(push(annotationURL.pathWithNote(action.id)))
			} else {
				syncAnnotationModalWithURL(store)
			}
			break
		case 'CLOSE_ANNOTATION_NOTE':
			// The reader closed the modal: push (not replace) the clean URL, so Back reopens
			// the note they were on rather than jumping to the middle of the chain
			if (typeof annotationURL.parseNoteParam() !== 'undefined') {
				store.dispatch(push(annotationURL.pathWithoutNote()))
			}
			break
		case 'GET_DOCUMENT_LIST':
			// 
			if (regex.checkIfDocTypePath(path) && regex.parseDocTypeFromPath(path) !== docType) {
				store.dispatch(actions.setDocType(regex.parseDocTypeFromPath(path)))
			}			
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
			if (action.state === 'annotationNote') {
				const noteParam = annotationURL.parseNoteParam()
				// Safety net for the deep-link/boot case, where no ON_LOCATION_CHANGED fires and
				// the modal element may not exist yet when the fetch starts: once the note the
				// URL asks for has loaded, make sure the modal is showing.
				if (action.status === 'success' && noteParam === action.id && !modalControl.isAnnotationModalOpen()) {
					modalControl.showAnnotationModal()
				}
				// A stale or bad deep link (deleted note) degrades to the plain document
				if (action.status === 'error' && noteParam === action.id) {
					modalControl.hideAnnotationModal()
					store.dispatch(actions.dismissAnnotationNote())
					store.dispatch(push(annotationURL.pathWithoutNote()))
				}
			}
			if (action.status === 'success' && action.state === 'currentDocument') {
				// For Info docs accessible through note paths, reset docType to notes after loading doc
				if (exemptNotePaths.indexOf(path) >= 0) {
					store.dispatch(actions.setDocType('notes'))
					break
				}

				// After successfully retrieving a currentDocument, redirect to its identifier to the path
				const actionIdentifier = action.docType === 'chapters' ? String(action.data.number) : action.data.id
				const pathIdentifier = action.docType === 'chapters' ? String(pathNumber) : pathID
				if (actionIdentifier !== pathIdentifier) {
					// Resolving a placeholder path (/:id) keeps an open note; a genuine document
					// change (e.g. picking another chapter) drops it, closing the modal
					const redirectPath = regex.checkIfRedirectPath(path) ? annotationURL.carryNoteParam(actionIdentifier) : actionIdentifier
					store.dispatch(push(redirectPath))
				}
				if (actionIdentifier === pathIdentifier && typeof hash !== 'undefined') {
					store.dispatch(actions.setCurrentBlock(action.data.id, hash))
				}
				const refreshCurrentBlock = store.getState().currentBlock
				// If this is a different document than the one referenced by currentBlock, unset currentBlock
				if (typeof(refreshCurrentBlock.id) !== 'undefined' && refreshCurrentBlock.id !== action.data.id) {
					store.dispatch(actions.unsetCurrentBlock())
				}

			}
			break
		case 'SET_EDITOR_STATE':
			// When the reader loads a new document, if a currentBlock is set, jump to it
			if (typeof(currentBlock.id) !== 'undefined' && currentBlock.id === currentDocument.id ) {
				const newEditorState = editorConstructor.returnEditorStateWithSearchTextFocus(action.data, currentBlock.key)
				action.data = newEditorState
			}
			break
		case 'SET_CURRENT_BLOCK':
			// When current block is set for a document that's already loaded, refresh the editorState with new focus
			if (typeof(currentBlock.id) !== 'undefined' && currentDocument.id === action.id && currentBlock.key !== action.key) {
				setTimeout(()=> {
					store.dispatch(actions.setCurrentDocument(action.id, docType))
				}, 15)
			}
			break
		case 'SAVE_DOCUMENT':
			// If successfully saving a new document, load it by pulling the id from the last document in the list
			if (action.status === 'success' && !action.id) {
				const sortedDocs = action.data.sort((a,b)=>b.created_at-a.created_at)
				store.dispatch(actions.setCurrentDocument(sortedDocs[0].id, action.docType))
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