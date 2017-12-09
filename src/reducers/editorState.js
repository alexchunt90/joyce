import { EditorState, ContentState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

const blankEditor = EditorState.createEmpty()

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.text))
				return editorState
			} else { return state }
		case 'CREATE_CHAPTER':
			return blankEditor
		case 'CREATE_NOTE':
			return blankEditor
		case 'UPDATE_EDITOR_STATE':
			return action.data
		default:
			return state
	}
}

export default editorState