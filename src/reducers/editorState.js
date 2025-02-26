import React from 'react'

import { 
	readerDecorator,
	editorDecorator,
	editPaginateDecorator,
} from '../modules/editorSettings'
import editorConstructor from '../modules/editorConstructor'

const blankEditor = editorConstructor.returnNewEditorState(readerDecorator)

const editorState = (state=blankEditor, action) => {
	switch(action.type) {
		// When a document has been succesfully retrieved, joyceInterface creates the editorState
		case 'SET_EDITOR_STATE':
			return action.data
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'currentDocument') {
				return blankEditor
			} else { return state }
		// When creating a new chapter, present a blank editor
		case 'CREATE_CHAPTER':
			return blankEditor
		case 'CREATE_DOCUMENT':
			return blankEditor
		// When we enter paginate mode, we want to display page breaks and hide links
		case 'SET_MODE':
			if (action.mode === 'PAGINATE_MODE') {
				return editorConstructor.returnEditorStateWithNewDecorator(state, editPaginateDecorator)
			} else {
				return editorConstructor.returnEditorStateWithNewDecorator(state, editorDecorator)
			}
			break
		// Update editor to reflect action
		case 'CANCEL_EDIT':
			return blankEditor
		case 'UPDATE_EDITOR_STATE':
			return action.data			
		case 'HANDLE_EDITOR_KEY_COMMAND':
			return editorConstructor.returnEditorStateFromKeyCommand(action.editorState, action.command)
		case 'APPLY_INLINE_STYLE':
			return editorConstructor.returnEditorStateWithInlineStyles(action.style, action.editorState)
		case 'TOGGLE_CUSTOM_CLASS':
			return editorConstructor.returnEditorStateWithCustomClass(action.editorState, action.className)
		case 'ADD_INLINE_IMAGE':
			return editorConstructor.returnEditorStateWithInlineImage(action.editorState, action.media)
		// After creating annotation, display updated editor state
		case 'ANNOTATION_CREATED':
			return action.editorState
		case 'EXTERNAL_URL_CREATED':
			return action.editorState
		case 'SUBMIT_NEW_PAGE_BREAK':
			const contentState = state.getCurrentContent()
			const editorStateWithPageBreak = editorConstructor.returnEditorStateWithNewPageBreak(
				contentState, 
				{
					year: action.year,
					number: action.pageNumber,
					selectionState: action.selectionState
				},
				editPaginateDecorator
			)
			return editorStateWithPageBreak
		// When user attempts to remove an annotation, generate a new content state without that entity and return it to the editor
		case 'REMOVE_ANNOTATION':
			const editorStateWithAnnotation = editorConstructor.returnEditorStateWithoutAnnotation(action)
			return editorStateWithAnnotation
		default:
			return state
	}
}

export default editorState