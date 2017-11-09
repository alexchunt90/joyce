import { combineReducers } from 'redux'
import objectAssign from 'object-assign' // Object.assign() polyfill for older browsers

const chapters = (state=[], action) => {
	switch(action.type) {
		case 'GET_CHAPTER_DATA_RECEIVED':
			return action.data
		default: 
			return state
	}
}

const highlightActive = (state=false, action) => {
	switch(action.type) {
		case 'TOGGLE_HIGHLIGHT':
			return !state
		default:
			return state
	}
}

const currentChapter = (state={}, action) => {
	switch(action.type) {
		case 'GET_TEXT_DATA_RECEIVED':
			return action.data
		default:
			return state
	}
}

const reduceReader = combineReducers({
	chapters,
	currentChapter,
	highlightActive
})

export default reduceReader