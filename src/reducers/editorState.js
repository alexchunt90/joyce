import { EditorState, ContentState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

const editorState = (state=(EditorState.createEmpty()), action) => {
	switch(action.type) {
		case 'UPDATE_EDITOR_STATE':
			return action.data
		case 'UPDATE_EDITED_CHAPTER':
			const contentState = stateFromHTML(action.data.text)
			const editorState = EditorState.createWithContent(contentState)
			return editorState
		default:
			return state
	}
}

export default editorState