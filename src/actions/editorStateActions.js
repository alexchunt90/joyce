// -------------------
// EditorState Actions
// -------------------
// These actions handle state changes for the DraftJS editor

const editorStateActions = {
	// Update EditorState on change
	updateEditorState: editorState =>
		({
			type: 'UPDATE_EDITOR_STATE',
			data: editorState
		}),
	// Handle Editor inline style buttons
	applyInlineStyles: (editorState, style) =>
		({
			type: 'APPLY_INLINE_STYLE',
			editorState: editorState,
			style: style
		}),
	// Handle key commands to apply inline styles
	handleEditorKeyCommand: (editorState, command) =>
		({
			type: 'HANDLE_EDITOR_KEY_COMMAND',
			editorState: editorState,
			command: command
		}),
}

export default editorStateActions