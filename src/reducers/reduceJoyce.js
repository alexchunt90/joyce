 // node_modules
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

// Documents
import chapters from './chapters'
import notes from './notes'
import tags from './tags'
import editions from './editions'
import media from './media'
import currentDocument from './currentDocument'
import annotationNote from './annotationNote'
import annotationNoteMedia from './annotationNoteMedia'
import annotationTag from './annotationTag'
import searchResults from './searchResults'

// User Inputs
import editorState from './editorState'
import modalEditorState from './modalEditorState'
import selectionState from './selectionState'
import inputs from './inputs'
// import documentTitleInput from './documentTitleInput'
// import colorPickerInput from './colorPickerInput'
// import searchInput from './searchInput'

import docType from './docType'
import mode from './mode'
import paginationState from './paginationState'
// Toggles
import toggles from './toggles'
// import highlightToggle from './highlightToggle'
// import loadingToggle from './loadingToggle'

// Validation
import userErrors from './userErrors'

const reduceJoyce = (history) => combineReducers({
	router: connectRouter(history),
	// Documents
	chapters: chapters,
	notes: notes,
	tags: tags,
	editions: editions,
	media: media,
	currentDocument: currentDocument,
	annotationNote: annotationNote,
	annotationNoteMedia: annotationNoteMedia,
	annotationTag: annotationTag,
	searchResults: searchResults,
	// User Inputs
	editorState: editorState,
	modalEditorState: modalEditorState,
	selectionState: selectionState,
	inputs: inputs,
	// Toggles
	docType: docType,
	mode: mode,
	paginationState: paginationState,
	toggles: toggles,
	// Validation
	userErrors: userErrors,
})

export default reduceJoyce