import { combineReducers } from 'redux'

import chapters from './chapters'
import notes from './notes'
import currentDocument from './currentDocument'
import editorState from './editorState'
import annotationNote from './annotationNote'
import highlightToggle from './highlightToggle'
import loadingToggle from './loadingToggle'
import docType from './docType'
import { routerReducer } from 'react-router-redux'
import mode from './mode'
import documentTitleInput from './documentTitleInput'
import searchResults from './searchResults'
import searchInput from './searchInput'

const reduceJoyce = combineReducers({
	chapters,
	notes,
	editorState,
	annotationNote,
	docType,
	currentDocument,
	highlightToggle,
	loadingToggle,
	routerReducer,
	mode,
	documentTitleInput,
	searchResults,
	searchInput	
})

export default reduceJoyce