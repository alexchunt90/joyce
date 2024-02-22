import React from 'react'
import { ReaderAnnotateButton, ReaderPaginateButton, ReaderEditButton, EditorDeleteToolButton, EditorCancelButton, EditorSubmitButton} from './button'
import { returnSelectionContentBlockClasses } from '../modules/editorSettings'

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

const EditorToolButton = ({glyph, onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-info btn-sm'>
		<i className={'fas fa-' + glyph}></i>
	</button>

const CSSClassObject = (name, className) => {
	return {
		'name': name,
		'className': className
	}
}

const customCSSClasses = [
	CSSClassObject('Stage Direction', 'stage-dir'),
	CSSClassObject('Serif Font', 'serif-font'),
	CSSClassObject('Character Tag', 'character-tag'),
	CSSClassObject('Question', 'question'),
	CSSClassObject('Bib', 'bib'),
	CSSClassObject('Page Break', 'break'),
	CSSClassObject('Dialog Lyrics', 'dialog-lyrics'),
]

const blockClassArray = editorState => returnSelectionContentBlockClasses(editorState) || []

export const EditorEditModeRichTextOptions = ({editorState, onToolButtonClick, disabled, onCustomClassToggle}) =>
	<div className='row'>
		<div className='col-5'>
			<div className='rich_text_button_group btn-group' role='group'>
				<EditorToolButton glyph='heading fa-md' onClick={()=>onToolButtonClick(editorState, 'header-one')}/>
				<EditorToolButton glyph='heading fa-sm' onClick={()=>onToolButtonClick(editorState, 'header-two')}/>
				<EditorToolButton glyph='heading fa-xs' onClick={()=>onToolButtonClick(editorState, 'header-three')}/>
				<EditorToolButton glyph='bold fa-sm' onClick={()=>onToolButtonClick(editorState, 'BOLD')}/>
				<EditorToolButton glyph='italic fa-sm' onClick={()=>onToolButtonClick(editorState, 'ITALIC')}/>
				<EditorToolButton glyph='underline fa-sm' onClick={()=>onToolButtonClick(editorState, 'UNDERLINE')}/>
				<button className='btn btn-info btn-sm dropdown-toggle' type='button' data-bs-toggle='dropdown' disabled={!returnSelectionContentBlockClasses(editorState)}>
			    	<i className='fas fa-hashtag fa-sm'></i>
			  	</button>		  	
				<ul className='dropdown-menu'>
					{customCSSClasses.map(obj => 
				    	<li key={obj.className}>
			    			<input onChange={()=>{onCustomClassToggle(editorState, obj.className)}} checked={blockClassArray(editorState).includes(obj.className)} className='form-check-input me-1' type='checkbox' />
				    		{obj.name}
			    		</li>
					)}
				</ul>			  	
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