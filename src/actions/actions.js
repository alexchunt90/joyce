const setCurrentChapter = id =>
	({
		type: 'GET_TEXT_DATA',
		id: id
	})

const toggleHighlight = () =>
	({
		type: 'TOGGLE_HIGHLIGHT'
	})

const updateEditorState = editorState =>
	({
		type: 'UPDATE_EDITOR_STATE',
		payload: editorState
	})
	
export {
	setCurrentChapter,
	toggleHighlight,
	updateEditorState
}