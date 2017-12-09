import React from 'react'

import { EditorTopbarToolButton } from './button'

export const EditModeTopBar = ({editorState, onToolButtonClick}) =>
	<div className='row'>
		<div className='col-md-12'>
			<div className='btn-group' role='group'>
				<EditorTopbarToolButton glyph='bold' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorTopbarToolButton glyph='italic' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorTopbarToolButton glyph='underline' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<EditorTopbarToolButton glyph='header' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
			</div>
		</div>
	</div>