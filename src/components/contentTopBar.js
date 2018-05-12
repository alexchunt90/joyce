import React from 'react'
import PropTypes from 'prop-types'

import { ReaderAnnotateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, AnnotatorNewButton, AnnotatorRemoveButton } from './button'

export const ReadModeTopBar = ({setMode}) =>
	<div className='row'>
		<div className='col-sm-5'>
			<ReaderAnnotateButton onClick={()=>setMode('ANNOTATE_MODE')}/>
		</div>
		<div className='col-sm-5 offset-sm-2'>
			<ReaderEditButton onClick={()=>setMode('EDIT_MODE')} />
		</div>
	</div>

export const EditModeTopBar = ({editorState, onToolButtonClick, disabled}) =>
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
			<EditorDeleteToolButton disabled={disabled}/>
		</div>
	</div>

export const AnnotateModeTopBar = ({onNewAnnotationClick, onRemoveAnnotationClick, addDisabled, removeDisabled}) =>
	<div className='row'>
		<div className='col-md-5'>
			<AnnotatorNewButton onClick={onNewAnnotationClick} disabled={addDisabled}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<AnnotatorRemoveButton onClick={onRemoveAnnotationClick} disabled={removeDisabled} />
		</div>	
	</div>

ReadModeTopBar.propTypes = {
	setMode: PropTypes.func,
}

EditModeTopBar.propTypes = {
	editorState: PropTypes.object,
	onToolButtonClick: PropTypes.func,
	disabled: PropTypes.bool,
}

AnnotateModeTopBar.propTypes = {
	onNewAnnotationClick: PropTypes.func,
	onRemoveAnnotationClick: PropTypes.func,
	onAddDisabled: PropTypes.bool,
	removeDisabled: PropTypes.bool,
}