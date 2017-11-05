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

const currentChapter = (state={}, action) => {
	switch(action.type) {
		case 'SET_CURRENT_CHAPTER':
			return objectAssign(
				{},	state,
				{currentChapter: {id: action.id, name: chapter.name}}
			)
		default:
			return state
	}
}

const readerApp = combineReducers({
	chapters,
	currentChapter
})

export default readerApp