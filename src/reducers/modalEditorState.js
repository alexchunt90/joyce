import React from 'react'
import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import { linkDecorator } from '../modules/editorSettings.js'

const blankEditor = EditorState.createEmpty(linkDecorator)

const modalEditorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'annotationNote') {
				const editorState = EditorState.createWithContent(stateFromHTML(action.data.html_source), linkDecorator)
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