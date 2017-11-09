import { EditorState } from 'draft-js'
import objectAssign from 'object-assign' // Object.assign() polyfill for older browsers
import actions from '../actions/actions'

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

const editorState = (state=(EditorState.createEmpty()), action) => {
	switch(action.type) {
		case 'UPDATE_EDITOR_STATE':
			console.log(action.payload.getSelection())
			return action.payload
		default:
			return state
	}
}

export {
	chapters,
	highlightActive,
	currentChapter,
	editorState
}