import React from 'react'

import { ReaderAnnotateButton, ReaderEditButton, EditorTopBarToolButton, EditorTopBarDeleteButton } from './button'

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
		<div className='col-md-6'>
			<div className='btn-group' role='group'>
				<EditorTopBarToolButton glyph='bold' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorTopBarToolButton glyph='italic' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorTopBarToolButton glyph='underline' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<EditorTopBarToolButton glyph='header' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
			</div>
		</div>
		<div className='col-md-6'>
			<EditorTopBarDeleteButton deleteDisabled={deleteDisabled}/>
		</div>
	</div>