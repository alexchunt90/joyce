import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

export const TextEditorReadOnly = ({editorState}) =>
	<div id='read_only_text_editor' className={'text_editor'}>
		<Editor editorState={editorState} readOnly={true}/>
	</div>

export const TextEditor = ({editorState, handleKeyCommand, onChange}) =>
	<div id='enabled_text_editor' className={'text_editor'}>
		<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChange}/>
	</div>