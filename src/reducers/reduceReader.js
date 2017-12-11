import { combineReducers } from 'redux'

import chapters from './chapters'
import currentDocument from './currentDocument'
import highlightActive from './highlightActive'
import docType from './docType'

const reduceReader = combineReducers({
	chapters,
	docType,
	currentDocument,
	highlightActive
})

export default reduceReader