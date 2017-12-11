import { combineReducers } from 'redux'

import chapters from './chapters'
import currentDocument from './currentDocument'
import highlightActive from './highlightActive'

const reduceReader = combineReducers({
	chapters,
	currentDocument,
	highlightActive
})

export default reduceReader