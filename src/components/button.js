import React from 'react'

export const ReaderEditButton = ({onClick}) =>
	<div className='edit_note_button'>
		<button onClick={onClick} className='btn btn-outline-primary btn-sm'>
			Edit
			<i className='fa fa_inline fa-edit'></i>
		</button>
	</div>

export const ReaderAnnotateButton = ({onClick}) =>
	<div className='annotate_note_button'>
		<button onClick={onClick} className='btn btn-outline-primary btn-sm'>
			Annotate
			<i className='fa fa_inline fa-link'></i>
		</button>
	</div>	

export const ChapterButton = ({chapter, currentChapter, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={()=>onClick(chapter.id)} className={currentChapter.id === chapter.id ? 'btn btn-dark btn-lg' : 'btn btn-outline-dark btn-lg'}>
			{chapter.title}
		</button>
	</div>

export const NoteButton = ({note, currentNote, onClick}) =>
	<div className ='note_button'>
		<button onClick={onClick} className={currentNote.id === note.id ? 'btn btn-warning' : 'btn btn-outline-warning'}>
			{note.title}
		</button>
	</div>

export const HighlightButton = ({highlightActive, onHighlightClick}) =>
	<div>
		<div id='highlight_button' className='text-center'>
			<button onClick={onHighlightClick} className={highlightActive ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'}>
				{highlightActive ? 'Hide Notes' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const NewChapterButton = ({onNewChapterClick}) =>
	<div>
		<div id='new_chapter_button' className='text-center'>
			<button onClick={onNewChapterClick} className='btn btn-outline-success btn-lg'>
				New Chapter <i className='fa fa_inline fa-plus-square-o'></i>
			</button>
		</div>
	</div>

const documentName = docType => {
	switch(docType) {
		case 'chapters':
			return 'Chapter'
			break
		case 'notes':
			return 'Note'
			break
	}	
}


export const NewDocumentButton = ({onClick, docType}) =>
	<div>
		<div id='new_document_button' className='text-center'>
			<button onClick={onClick} className='btn btn-outline-success btn-sm'>
				New {documentName(docType)}
				<i className='fa fa_inline fa-plus-square-o'></i>
			</button>
		</div>
	</div>

// Fairly abstracted

export const AnnotatorNewButton = ({onClick, disabled}) =>
	<button type='button' onClick={onClick} disabled={disabled} className='btn btn-info btn-sm' data-toggle='modal' data-target='#annotate_modal'>
		New Annotation
		<i className='fa fa_inline fa-link'></i>
	</button>

export const AnnotatorRemoveButton = ({onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-secondary btn-sm'>
		Remove Annotation
		<i className='fa fa_inline fa-unlink'></i>		
	</button>

export const EditorToolButton = ({glyph, onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-info btn-sm'>
		<i className={'fa fa-' + glyph}></i>
	</button>


export const EditorDeleteToolButton = ({disabled}) =>
	<button className='btn btn-info btn-sm' disabled={disabled} data-toggle='modal' data-target='#delete_confirm_modal' type='button'>
		Delete
		<i className='fa fa_inline fa-trash-o'></i>
	</button>

export const EditorCancelButton = ({onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-outline-secondary btn-sm' data-dismiss='modal'>
		Cancel
		<i className='fa fa_inline fa-times'></i>
	</button>

export const EditorSubmitButton = ({onClick}) =>
	<button id='editor_submit' onClick={onClick} type='button' data-dismiss='modal' className='btn btn-outline-success btn-sm'>
		Submit
		<i className='fa fa_inline fa-check-square-o'></i>
	</button>

export const EditorDeleteButton = ({onClick}) =>
	<button id='editor_delete' onClick={onClick} type='button' data-dismiss='modal' className='btn btn-outline-danger btn-sm'>
		Delete
		<i className='fa fa_inline fa-trash-o'></i>
	</button>