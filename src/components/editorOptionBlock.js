import React from 'react'
import { ReaderAnnotateButton, ReaderPaginateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, EditorCancelButton, EditorSubmitButton} from './button'

export const EditorReadModeOptions = ({setMode, docType}) =>
	<div className='row'>
		
		<div className='topbar_button col-4 ml-auto'>
			<ReaderEditButton onClick={()=>setMode('EDIT_MODE')} />
		</div>

		{['chapters', 'notes'].indexOf(docType) >= 0 &&
			<div className='topbar_button col-4 ml-auto'>
				<ReaderAnnotateButton onClick={()=>setMode('ANNOTATE_MODE')}/>
			</div>
		}

		{docType === 'chapters' && 
			<div className='topbar_button col-4 ml-auto'>
				<ReaderPaginateButton onClick={()=>setMode('PAGINATE_MODE')}/>
			</div>
		}

	</div>

export const EditorEditModeRichTextOptions = ({editorState, onToolButtonClick, disabled}) =>
	<div className='row'>
		<div className='col-5'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorToolButton glyph='heading fa-md' onClick={()=>onToolButtonClick(editorState, 'header-one')}/>
				<EditorToolButton glyph='heading fa-sm' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
				<EditorToolButton glyph='heading fa-xs' onClick={()=>onToolButtonClick(editorState, 'header-three')}/>
				<EditorToolButton glyph='bold fa-sm' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorToolButton glyph='italic fa-sm' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorToolButton glyph='underline fa-sm' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
			</div>
		</div>
		<div className='col-5'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorToolButton glyph='align-left fa-sm' onClick={()=>onToolButtonClick(editorState, 'left-align')}/>
				<EditorToolButton glyph='align-center fa-sm' onClick={()=>onToolButtonClick(editorState, 'center-align')}/>
				<EditorToolButton glyph='align-right fa-sm' onClick={()=>onToolButtonClick(editorState, 'right-align')}/>
				<EditorToolButton glyph='align-justify fa-sm' onClick={()=>onToolButtonClick(editorState, 'justify-align')}/>
				<EditorToolButton glyph='outdent fa-sm' onClick={()=>onToolButtonClick(editorState, 'no-indent')}/>
				<EditorToolButton glyph='indent fa-sm' onClick={()=>onToolButtonClick(editorState, 'add-indent')}/>
				<EditorToolButton glyph='quote-left fa-sm' onClick={()=>onToolButtonClick(editorState, 'blockquote')}/>
			</div>
		</div>			
		<div className='col-2'>
			<EditorDeleteToolButton disabled={disabled}/>
		</div>
	</div>

export const EditorSubmitOptions = ({cancelEdit, onSubmitClick}) =>
	<div className='row mt-2'>
		<div className='submit_option_button col-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='submit_option_button col-5 offset-2'>
			<EditorSubmitButton onClick={onSubmitClick} />
		</div>
	</div>