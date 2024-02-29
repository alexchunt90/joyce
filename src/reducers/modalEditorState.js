import React from 'react'

import { modalDecorator } from '../modules/editorSettings'
import editorConstructor from '../modules/editorConstructor'

const blankEditor = editorConstructor.returnNewEditorState(modalDecorator)

const modalEditorState = (state=blankEditor, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'annotationNote') {
				const editorState = editorConstructor.returnEditorStateFromHTML(action.data.html_source, modalDecorator)
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