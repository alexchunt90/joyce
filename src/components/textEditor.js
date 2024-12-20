import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import { blockStyleFn, blockRenderFn, keyBindingFn } from '../modules/editorSettings'
import { ImageGroup } from './image'

export const TextEditorReadOnly = ({editorState, noteMedia=[], docType}) =>
	<div id='read_only_text_editor' className={docType + '_editor text_editor'}>
		<Editor 
			editorState={editorState} 
			blockStyleFn={blockStyleFn} 
			blockRendererFn={blockRenderFn} 
			readOnly={true}/>
		{docType === 'notes' && noteMedia.length >= 1 &&
			<ImageGroup media_docs={noteMedia} />
		}
	</div>

export const TextEditor = ({editorState, docType, handleKeyCommand, handleReturn, onChange, onTab}) =>
	<div id='enabled_text_editor' className={docType + '_editor text_editor'}>
		<Editor 
			editorState={editorState} 
			blockStyleFn={blockStyleFn} 
			blockRendererFn={blockRenderFn} 
			handleKeyCommand={handleKeyCommand}
			onChange={onChange}
			keyBindingFn={keyBindingFn} />
	</div>