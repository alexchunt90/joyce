import React from 'react'

import { linkDecorator, returnNewEditorState, returnEditorStateFromHTML, returnEditorStateFromKeyCommand, returnEditorStateWithInlineStyles, returnEditorStateWithoutAnnotation } from '../modules/editorSettings.js'

const blankEditor = returnNewEditorState(linkDecorator)

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		// When a document has been succesfully retrieved, create editor state using stateFromHTML
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				// TODO: Remove references to caption_html once image implementation is complete
				const html = action.data.caption_html || action.data.html_source
				const editorState = returnEditorStateFromHTML(html, linkDecorator)
				return editorState
			} else if (action.status === 'request' && action.state === 'currentDocument') {
				return blankEditor
			} else { return state }
		// When creating a new chapter, present a blank editor
		case 'CREATE_CHAPTER':
			return blankEditor
		case 'CREATE_DOCUMENT':
			return blankEditor
		// Update editor to reflect action
		case 'CANCEL_EDIT':
			return blankEditor
		case 'UPDATE_EDITOR_STATE':
			return action.data
		case 'HANDLE_EDITOR_KEY_COMMAND':
			return returnEditorStateFromKeyCommand(action.editorState, action.command)
		case 'APPLY_INLINE_STYLE':
			return returnEditorStateWithInlineStyles(action.style, action.editorState)
		// After creating annotation, display updated editor state
		case 'ANNOTATION_CREATED':
			return action.editorState
		// When user attempts to remove an annotation, generate a new content state without that entity and return it to the editor
		case 'REMOVE_ANNOTATION':
			const editorStateWithAnnotation = returnEditorStateWithoutAnnotation(action)
			return editorStateWithAnnotation
		default:
			return state
	}
}

export default editorState