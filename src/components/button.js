import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import romanize from '../modules/romanize'
import helpers from '../modules/helpers'

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
		<button onClick={onClick} className={currentChapter.id === chapter.id ? 'btn btn-dark btn-lg active_button' : 'btn btn-outline-dark btn-lg inactive_button'}>
			{romanize(chapter.number)}. {chapter.title}
		</button>
	</div>

export const NoteButton = ({note, currentNote, onClick}) =>
	<div className ='note_button'>
		<button onClick={onClick} className={currentNote.id === note.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
			{note.title}
		</button>
	</div>

export const HighlightButton = ({highlightToggle, onClick}) =>
	<div>
		<div id='highlight_button' className='text-center'>
			<button onClick={onClick} className={highlightToggle ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'}>
				{highlightToggle ? 'Hide Notes' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const SearchButton = ({searchInput, onClick}) =>
	<div>
		<div id='search_button' className='text-center'>
			<button className='btn btn-primary btn-sm' onClick={()=>onClick(searchInput)}>
				Search <i className='fa fa_inline fa-search'></i>
			</button>
		</div>
	</div>

export const NewChapterButton = ({onClick}) =>
	<div>
		<div id='new_chapter_button' className='text-center'>
			<button onClick={onClick} className='btn btn-outline-success btn-lg'>
				New Chapter <i className='fa fa_inline fa-plus-square-o'></i>
			</button>
		</div>
	</div>

export const NewDocumentButton = ({onClick, docType}) =>
	<div>
		<div id='new_document_button' className='text-center'>
			<button onClick={onClick} className='btn btn-outline-success btn-sm'>
				New {helpers.docTypeName(docType)}
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

export const AnnotatorRemoveButton = ({onClick, disabled}) =>
	<button type='button' onClick={onClick} disabled={disabled} className='btn btn-secondary btn-sm'>
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

ReaderEditButton.propTypes = {
	onClick: PropTypes.func,
}

ReaderAnnotateButton.propTypes = {
	onClick: PropTypes.func,
}

ChapterButton.propTypes = {
	chapters: PropTypes.arrayOf(PropTypes.object),
	currentChapter: PropTypes.object,
	onClick: PropTypes.func,
}

NoteButton.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	currentNotes: PropTypes.object,	
	onClick: PropTypes.func,
}

HighlightButton.propTypes = {
	highlightToggle: PropTypes.bool,
	onClick: PropTypes.func,
}

SearchButton.propTypes = {
	searchInput: PropTypes.string,
	onClick: PropTypes.func,
}

NewChapterButton.propTypes = {
	onClick: PropTypes.func,
}

NewDocumentButton.propTypes = {
	docType: PropTypes.string,
	onClick: PropTypes.func,
}

AnnotatorNewButton.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
}

AnnotatorRemoveButton.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
}

EditorToolButton.propTypes = {
	glyph: PropTypes.string,
	onClick: PropTypes.func,
}

EditorDeleteToolButton.propTypes = {
	disabled: PropTypes.bool,
}

EditorCancelButton.propTypes = {
	onClick: PropTypes.func,
}

EditorSubmitButton.propTypes = {
	onClick: PropTypes.func,
}

EditorDeleteButton.propTypes = {
	onClick: PropTypes.func,
}