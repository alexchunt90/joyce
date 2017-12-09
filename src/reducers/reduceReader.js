import { combineReducers } from 'redux'

import chapters from './chapters'
import currentChapter from './currentChapter'
import highlightActive from './highlightActive'

const reduceReader = combineReducers({
	chapters,
	currentChapter,
	highlightActive
})

export default reduceReader