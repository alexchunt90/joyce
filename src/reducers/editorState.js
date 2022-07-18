import React from 'react'
import { EditorState, RichUtils, Modifier } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import { linkDecorator } from '../modules/editorSettings.js'

const blankEditor = EditorState.createEmpty(linkDecorator)

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		// When a document has been succesfully retrieved, create editor state using stateFromHTML
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.html_source), linkDecorator)
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
		case 'UPDATE_EDITOR_STATE':
			return action.data
		case 'HANDLE_EDITOR_KEY_COMMAND':
			const editorState = RichUtils.handleKeyCommand(action.editorState, action.command)
			// Null check to handle null editorState when backspacking empty editor
			if (editorState !== null) {
				return editorState
			} else { return state }
		case 'APPLY_INLINE_STYLE':
			// Rework this when adding more inline style options to the editor
			let inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
			if (inlineStyles.indexOf(action.style) >= 0) {
				return RichUtils.toggleInlineStyle(action.editorState, action.style)
			} else if (action.style === 'header-two') {
				return RichUtils.toggleBlockType(action.editorState, 'header-two')
			}
			break
		// After creating annotation, display updated editor state
		case 'ANNOTATION_CREATED':
			return action.editorState
		// When user attempts to remove an annotation, generate a new content state without that entity and return it to the editor
		case 'REMOVE_ANNOTATION':
			const contentStateWithoutLink = Modifier.applyEntity(
  				action.editorState.getCurrentContent(),
  				action.selectionState,
  				null
			)
			return EditorState.createWithContent(contentStateWithoutLink, linkDecorator)			
		default:
			return state
	}
}

export default editorState