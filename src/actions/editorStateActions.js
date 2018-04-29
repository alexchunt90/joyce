//
// EditorState Actions
// 
	// These actions handle state changes for the DraftJS editor

	// Update EditorState on change
	export const updateEditorState = editorState =>
		({
			type: 'UPDATE_EDITOR_STATE',
			data: editorState
		})

	// Handle Editor inline style buttons
	export const applyInlineStyles = (editorState, style) =>
		({
			type: 'APPLY_INLINE_STYLE',
			editorState: editorState,
			style: style
		})

	// Handle key commands to apply inline styles
	export const handleEditorKeyCommand = (editorState, command) =>
		({
			type: 'HANDLE_EDITOR_KEY_COMMAND',
			editorState: editorState,
			command: command
		})