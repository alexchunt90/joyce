import React from 'react'
import { EditorCancelButton, EditorSubmitButton} from './button'
import { returnSelectionContentBlockClasses } from '../modules/editorSettings'
import { CUSTOM_CSS_CLASSES } from '../config'

// 
// Config
// 

const customCSSClasses = CUSTOM_CSS_CLASSES

// 
// Internal components
// 

const EditorToolButton = ({glyph, onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-info btn-sm'>
		<i className={'fas fa-' + glyph}></i>
	</button>

const EditorDeleteToolButton = ({disabled}) =>
	<button className='btn btn-info btn-sm' disabled={disabled} data-bs-toggle='modal' data-bs-target='#delete_confirm_modal' type='button'>
		<i className='fas fa-trash fa-sm'></i>
	</button>

const EditorDropdownToolButton = ({glyph, disabled=false}) =>
	<button className='btn btn-info btn-sm dropdown-toggle' type='button' data-bs-toggle='dropdown' disabled={disabled}>
    	<i className={'fas fa-' + glyph +' fa-sm'}></i>
  	</button>	

const ReaderEditButton = ({onClick}) =>
	<div className='edit_note_button topbar_mode_button'>
		<button onClick={onClick} className='btn btn-primary btn-sm'>
			Edit
			<i className='fas fa_inline fa-edit'></i>
		</button>
	</div>

const ReaderAnnotateButton = ({onClick}) =>
	<div className='annotate_note_button topbar_mode_button'>
		<button onClick={onClick} className='btn btn-primary btn-sm'>
			Annotate
			<i className='fas fa_inline fa-link'></i>
		</button>
	</div>

const ReaderPaginateButton = ({onClick}) =>
	<div className='paginate_note_button topbar_mode_button'>
		<button onClick={onClick} className='btn btn-primary btn-sm'>
			Paginate
			<i className='fas fa_inline fa-file-lines'></i>
		</button>
	</div>


// 
// Exported components
// 

export const EditorEditModeRichTextOptions = ({editorState, media, onToolButtonClick, disabled, onCustomClassToggle, onMediaCheckboxClick}) =>
	<div className='row'>
		<div className='col-md-10 col-12'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorToolButton glyph='heading fa-md' onClick={()=>onToolButtonClick(editorState, 'header-one')}/>
				<EditorToolButton glyph='heading fa-sm' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
				<EditorToolButton glyph='heading fa-xs' onClick={()=>onToolButtonClick(editorState, 'header-three')}/>
				<EditorToolButton glyph='bold fa-sm' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorToolButton glyph='italic fa-sm' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorToolButton glyph='underline fa-sm' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<EditorToolButton glyph='align-left fa-sm' onClick={()=>onToolButtonClick(editorState, 'left-align')}/>
				<EditorToolButton glyph='align-center fa-sm' onClick={()=>onToolButtonClick(editorState, 'center-align')}/>
				<EditorToolButton glyph='align-right fa-sm' onClick={()=>onToolButtonClick(editorState, 'right-align')}/>
				<EditorToolButton glyph='align-justify fa-sm' onClick={()=>onToolButtonClick(editorState, 'justify-align')}/>
				<EditorToolButton glyph='outdent fa-sm' onClick={()=>onToolButtonClick(editorState, 'no-indent')}/>
				<EditorToolButton glyph='indent fa-sm' onClick={()=>onToolButtonClick(editorState, 'add-indent')}/>
				<EditorToolButton glyph='quote-left fa-sm' onClick={()=>onToolButtonClick(editorState, 'blockquote')}/>
				<EditorDropdownToolButton glyph={'code'} disabled={!editorState.getSelection().isCollapsed()} />
				<ul className='dropdown-menu'>
					{customCSSClasses.map(obj => 
			    		<li key={obj.className}>
		    				<input onChange={()=>{onCustomClassToggle(editorState, obj.className)}} checked={returnSelectionContentBlockClasses(editorState).includes(obj.className)} className='form-check-input me-1' type='checkbox' />
			    			{obj.name}
		    			</li>
					)}
				</ul>
			</div>
		</div>
		<div className='col-md-1 col-6'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorDropdownToolButton glyph={'image'} disabled={!editorState.getSelection().isCollapsed()}/>		
				<ul className='dropdown-menu note-picker-dropdown'>
					{media.map(media =>
			    		<li key={media.id}>
			    			<a onClick={()=>onMediaCheckboxClick(editorState, media)} data-toggle='collapse' data-target='.note-picker-dropdown' className='ms-1'>
								{media.title}
							</a>
		    			</li>
					)}
				</ul>
			</div>
		</div>			
		<div className='col-md-1 col-6'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorDeleteToolButton disabled={disabled}/>
			</div>
		</div>
	</div>

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

export const EditorSubmitOptions = ({cancelEdit, onSubmitClick}) =>
	<div className='row mt-2'>
		<div className='submit_option_button col-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='submit_option_button col-5 offset-2'>
			<EditorSubmitButton onClick={onSubmitClick} />
		</div>
	</div>