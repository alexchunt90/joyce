import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import TagColorPreview from './tagColorPreview'
import helpers from '../modules/helpers'

export const ReaderEditButton = ({onClick}) =>
	<div className='edit_note_button'>
		<button onClick={onClick} className='btn btn-outline-primary btn-sm'>
			Edit
			<i className='fas fa_inline fa-edit'></i>
		</button>
	</div>

export const ReaderAnnotateButton = ({onClick}) =>
	<div className='annotate_note_button'>
		<button onClick={onClick} className='btn btn-outline-primary btn-sm'>
			Annotate
			<i className='fas fa_inline fa-link'></i>
		</button>
	</div>

export const ReaderPaginateButton = ({onClick}) =>
	<div className='paginate_note_button'>
		<button onClick={onClick} className='btn btn-outline-primary btn-sm'>
			Paginate
			<i className='fas fa_inline fa-file-lines'></i>
		</button>
	</div>	

export const ChapterButton = ({chapter, currentChapter, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={onClick} className={currentChapter.id === chapter.id ? 'btn btn-dark btn-lg active_button' : 'btn btn-outline-dark btn-lg inactive_button'}>
			{chapter.number}. {chapter.title}
		</button>
	</div>

export const NoteButton = ({note, currentNote, onClick}) =>
	<div className ='note_button'>
		<button onClick={onClick} className={currentNote.id === note.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
			{note.title}
		</button>
	</div>

export const TagButton = ({tag, currentTag, onClick}) =>
	<div className ='tag_button'>
		<button onClick={onClick} className={currentTag.id === tag.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
			<TagColorPreview color={tag.color}/>
			{tag.title}
		</button>
	</div>

export const EditionButton = ({edition, currentEdition, onClick}) =>
	<div className ='edition_button'>
		<button onClick={onClick} className={currentEdition.id === edition.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
			{edition.title} ({edition.year})
		</button>
	</div>	

export const MediaButton = ({media, currentMediaId, onClick}) =>
	<div className ='media_button'>
		<button onClick={onClick} className={currentMediaId === media.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
			{media.title}
		</button>
	</div>

export const HighlightButton = ({toggle, onClick, size='lg'}) =>
	<div>
		<div id='highlight_button' className='text-center'>
			<button onClick={onClick} className={toggle ? 'btn btn-primary btn-' + size : 'btn btn-outline-primary btn-' + size}>
				{toggle ? 'Hide Notes' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const SearchButton = ({onClick, searchInput, docTypes, resultCount}) =>
	<div>
		<div id='search_button' className='text-center'>
			<button className='btn btn-primary btn-sm' onClick={()=>onClick(searchInput, docTypes, resultCount)}>
				Search <i className='fas fa_inline fa-search'></i>
			</button>
		</div>
	</div>

export const NewChapterButton = ({onClick}) =>
	<div>
		<div id='new_chapter_button' className='text-center'>
			<button onClick={onClick} className='btn btn-outline-success btn-lg'>
				New Chapter <i className='fas fa_inline fa-plus-square-o'></i>
			</button>
		</div>
	</div>

export const NewDocumentButton = ({onClick, docType}) =>
	<div>
		<div id='new_document_button' className='text-center'>
			<button onClick={onClick} className='btn btn-outline-success btn-sm'>
				New {helpers.docTypeName(docType)}
				<i className='fas fa_inline fa-plus-square'></i>
			</button>
		</div>
	</div>

// Fairly abstracted

export const EditorToolButton = ({glyph, onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-info btn-sm'>
		<i className={'fas fa-' + glyph}></i>
	</button>


export const EditorDeleteToolButton = ({disabled}) =>
	<button className='btn btn-info btn-sm' disabled={disabled} data-toggle='modal' data-target='#delete_confirm_modal' type='button'>
		Delete
		<i className='fas fa_inline fa-trash-o'></i>
	</button>

export const EditorCancelButton = ({onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-outline-secondary btn-sm' data-dismiss='modal'>
		Cancel
		<i className='fas fa_inline fa-times'></i>
	</button>

export const EditorSubmitButton = ({onClick}) =>
	<button id='editor_submit' onClick={onClick} type='button' className='btn btn-outline-success btn-sm'>
		Submit
		<i className='fas fa_inline fa-check-square-o'></i>
	</button>

export const EditorDeleteButton = ({onClick}) =>
	<button id='editor_delete' onClick={onClick} type='button' data-dismiss='modal' className='btn btn-outline-danger btn-sm'>
		Delete
		<i className='fas fa_inline fa-trash-o'></i>
	</button>





// Logout

export const LogoutButton = ({onClick}) =>
	<button id='admin_signout_button' onClick={onClick} type='button' className='btn btn-outline-danger'>
		Logout
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
	toggle: PropTypes.bool,
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