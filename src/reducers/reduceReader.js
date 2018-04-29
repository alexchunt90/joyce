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


const reduceReader = combineReducers({
	chapters,
	notes,
	editorState,
	annotationNote,
	docType,
	currentDocument,
	highlightToggle,
	loadingToggle,
	routerReducer
})

export default reduceReader