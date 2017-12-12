import { combineReducers } from 'redux'

import chapters from './chapters'
import notes from './notes'
import currentDocument from './currentDocument'
import editorState from './editorState'
import annotationNote from './annotationNote'
import highlightActive from './highlightActive'
import docType from './docType'

const reduceReader = combineReducers({
	chapters,
	notes,
	editorState,
	annotationNote,
	docType,
	currentDocument,
	highlightActive
})

export default reduceReader