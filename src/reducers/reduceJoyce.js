 // node_modules
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Documents
import chapters from './chapters'
import notes from './notes'
import tags from './tags'
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
// Toggles
import toggles from './toggles'
// import highlightToggle from './highlightToggle'
// import loadingToggle from './loadingToggle'

// Validation
import userErrors from './userErrors'

const reduceJoyce = combineReducers({
	routerReducer,
	// Documents
	chapters,
	notes,
	tags,
	media,
	currentDocument,
	annotationNote,
	annotationNoteMedia,
	annotationTag,
	searchResults,
	// User Inputs
	editorState,
	modalEditorState,
	selectionState,
	inputs,
	// colorPickerInput,
	// documentTitleInput,
	// searchInput,
	// Toggles
	docType,
	mode,
	toggles,
	// highlightToggle,
	// loadingToggle,
	// Validation
	userErrors,
})

export default reduceJoyce