// node_modules
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Documents
import chapters from './chapters'
import notes from './notes'
import tags from './tags'
import currentDocument from './currentDocument'
import annotationNote from './annotationNote'
import annotationTag from './annotationTag'
import searchResults from './searchResults'

// User Inputs
import editorState from './editorState'
import selectionState from './selectionState'
import documentTitleInput from './documentTitleInput'
import colorPickerInput from './colorPickerInput'
import searchInput from './searchInput'

// Toggles
import docType from './docType'
import mode from './mode'
import highlightToggle from './highlightToggle'
import loadingToggle from './loadingToggle'

// Validation
import userErrors from './userErrors'

const reduceJoyce = combineReducers({
	routerReducer,
	// Documents
	chapters,
	notes,
	tags,
	currentDocument,
	annotationNote,
	annotationTag,
	searchResults,
	// User Inputs
	editorState,
	selectionState,
	colorPickerInput,
	documentTitleInput,
	searchInput,
	// Toggles
	docType,
	mode,
	highlightToggle,
	loadingToggle,
	// Validation
	userErrors,
})

export default reduceJoyce