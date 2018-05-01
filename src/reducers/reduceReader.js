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

const reduceReader = combineReducers({
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
	documentTitleInput
})

export default reduceReader