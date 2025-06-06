// -------------------
// EditorState Actions
// -------------------
// These actions handle state changes for the DraftJS editor

const editorStateActions = {
	// This is called when the joyceInterface middleware successfully loads a new currentDocument
	setEditorState: editorState => 
		({
			type: 'SET_EDITOR_STATE',
			data: editorState
		}),
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
	toggleCustomClass: (editorState, className) =>
		({
			type: 'TOGGLE_CUSTOM_CLASS',
			editorState: editorState,
			className: className
		}),
	addInlineImage: (editorState, media) =>
		({
			type: 'ADD_INLINE_IMAGE',
			editorState: editorState,
			media: media,
		}),
	// Handle key commands to apply inline styles
	handleEditorKeyCommand: (editorState, command) =>
		({
			type: 'HANDLE_EDITOR_KEY_COMMAND',
			editorState: editorState,
			command: command
		}),
	annotationCreated: (editorState) =>
		({
			type: 'ANNOTATION_CREATED',
			editorState: editorState
		}),
	externalURLCreated: (editorState) =>
		({
			type: 'EXTERNAL_URL_CREATED',
			editorState: editorState
		}),
	returnValidationErrors: (validationErrors) =>
		({
			type: 'RETURN_EDITOR_VALIDATION_ERRORS',
			errors: validationErrors
		}),
	loadPagination: () =>
		({
			type: 'LOAD_PAGINATION',
		})
}

export default editorStateActions