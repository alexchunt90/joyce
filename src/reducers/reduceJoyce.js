// node_modules
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Documents
import chapters from './chapters'
import notes from './notes'
import tags from './tags'
import currentDocument from './currentDocument'
import annotationNote from './annotationNote'
import searchResults from './searchResults'

// User Inputs
import editorState from './editorState'
import selectionState from './selectionState'
import documentTitleInput from './documentTitleInput'
import searchInput from './searchInput'

// Toggles
import docType from './docType'
import mode from './mode'
import highlightToggle from './highlightToggle'
import loadingToggle from './loadingToggle'

const reduceJoyce = combineReducers({
	routerReducer,
	//
	chapters,
	notes,
	tags,
	currentDocument,
	annotationNote,
	searchResults,
	//
	editorState,
	selectionState,
	documentTitleInput,
	searchInput,
	//
	docType,
	mode,
	highlightToggle,
	loadingToggle
})

export default reduceJoyce