import React from 'react'
import { connect } from 'react-redux'
import { updateEditorState } from '../actions/actions'

import { Editor, convertToRaw } from 'draft-js';

import EditorButtonGroup from '../components/editorButtonGroup'

const TextEditor = ({editorState, onSaveEditorState}) =>
	<div id="text_editor">
		<EditorButtonGroup />
		<Editor editorState={editorState} onChange={onSaveEditorState} />
		{JSON.stringify(editorState.getSelection())}
	</div>

const mapStateToProps = state => {
	return {
		editorState: state.editorState
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSaveEditorState: editorState => {
			dispatch(updateEditorState(editorState))
		}
	}
}

const TextEditorContainer = connect(mapStateToProps, mapDispatchToProps)(TextEditor)

export default TextEditorContainer