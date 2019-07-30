import React from 'react'
import { ReaderAnnotateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, AnnotatorNewButton, AnnotatorRemoveButton, EditorCancelButton, EditorSubmitButton} from './button'

export const EditorReadModeOptions = ({setMode, docType}) =>
	<div className='row'>
		{['chapters', 'notes'].indexOf(docType) >= 0 &&
			<div className='topbar_button col-5'>
				<ReaderAnnotateButton onClick={()=>setMode('ANNOTATE_MODE')}/>
			</div>
		}
		<div className='topbar_button col-5 ml-auto'>
			<ReaderEditButton onClick={()=>setMode('EDIT_MODE')} />
		</div>
	</div>

export const EditorEditModeRichTextOptions = ({editorState, onToolButtonClick, disabled}) =>
	<div className='row'>
		<div className='col-5'>
			<div id='rich_text_button_group' className='btn-group' role='group'>
				<EditorToolButton glyph='bold' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorToolButton glyph='italic' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorToolButton glyph='underline' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<EditorToolButton glyph='heading' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
			</div>
		</div>
		<div className='col-5 offset-2'>
			<EditorDeleteToolButton disabled={disabled}/>
		</div>
	</div>

export const EditorSubmitOptions = ({cancelEdit, onSubmitClick}) =>
	<div className='row'>
		<div className='submit_option_button col-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='submit_option_button col-5 offset-2'>
			<EditorSubmitButton onClick={onSubmitClick} />
		</div>
	</div>

export const EditorAnnotateOptions = ({onNewAnnotationClick, onRemoveAnnotationClick, addDisabled, removeDisabled}) =>
	<div className='row'>
		<div className='annotate_option_button col-5'>
			<AnnotatorNewButton onClick={onNewAnnotationClick} disabled={addDisabled}/>
		</div>
		<div className='annotate_option_button col-5 offset-2'>
			<AnnotatorRemoveButton onClick={onRemoveAnnotationClick} disabled={removeDisabled} />
		</div>	
	</div>	