import React from 'react'

import { ReaderAnnotateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, AnnotatorNewButton, AnnotatorRemoveButton } from './button'

export const ReadModeTopBar = ({setMode}) =>
	<div className='row'>
		<div className='col-md-5'>
			<ReaderAnnotateButton onClick={()=>setMode('ANNOTATE_MODE')}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<ReaderEditButton onClick={()=>setMode('EDIT_MODE')} />
		</div>
	</div>

export const EditModeTopBar = ({editorState, onToolButtonClick, deleteDisabled}) =>
	<div className='row'>
		<div className='col-md-5'>
			<div className='btn-group' role='group'>
				<EditorToolButton glyph='bold' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorToolButton glyph='italic' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorToolButton glyph='underline' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<EditorToolButton glyph='header' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
			</div>
		</div>
		<div className='col-md-5 offset-md-2'>
			<EditorDeleteToolButton deleteDisabled={deleteDisabled}/>
		</div>
	</div>

export const AnnotateModeTopBar = ({editorState}) =>
	<div className='row'>
		<div className='col-md-5'>
			<AnnotatorNewButton onClick={()=>console.log('ANNOTATE_MODE')}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<AnnotatorRemoveButton onClick={()=>console.log('EDIT_MODE')} />
		</div>	
	</div>