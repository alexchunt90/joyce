import React from 'react'

import { EditorTopBarToolButton, EditorTopBarDeleteButton } from './button'

export const EditModeTopBar = ({editorState, onToolButtonClick}) =>
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
			<EditorTopBarDeleteButton />
		</div>
	</div>