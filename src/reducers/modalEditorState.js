import React from 'react'
import { EditorState } from 'draft-js'

import { stateFromHTML, modalLinkDecorator } from '../modules/editorSettings.js'

const blankEditor = EditorState.createEmpty(modalLinkDecorator)

const modalEditorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'annotationNote') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.html_source), modalLinkDecorator)
				return editorState
			} else if (action.status === 'request' && action.state === 'annotationNote') {
				return blankEditor
			} else { return state }
		case 'ANNOTATION_CREATED':
			return blankEditor
		default:
			return state
	}
}

export default modalEditorState