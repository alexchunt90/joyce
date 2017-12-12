import { combineReducers } from 'redux'

import chapters from './chapters'
import notes from './notes'
import currentDocument from './currentDocument'
import annotationNote from './annotationNote'
import highlightActive from './highlightActive'
import docType from './docType'

const reduceReader = combineReducers({
	chapters,
	notes,
	annotationNote,
	docType,
	currentDocument,
	highlightActive
})

export default reduceReader