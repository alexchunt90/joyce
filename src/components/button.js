import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import helpers from '../modules/helpers'

export const HighlightButton = ({toggle, onClick, size='md', theme='primary'}) =>
	<div>
		<div className='sidebar_button text-center'>
			<button onClick={onClick} className={toggle ? 'btn btn-' + theme + ' btn-' + size : 'btn btn-info btn-' + size}>
				{toggle ? 'Hide Notes' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const IndexNotesButton = ({onClick, size='md', theme='primary'}) =>
	<div>
		<div className='sidebar_button text-center'>
			<Link to='/notes/index' className={'btn btn-' + theme + ' btn-' + size}>
				Index of Notes
			</Link>
		</div>
	</div>

export const TallyNotesButton = ({onClick, size='md', theme='primary'}) =>
	<div>
		<div className='sidebar_button text-center'>
			<Link to='/notes/tally' className={'btn btn-' + theme + ' btn-' + size}>
				Tally of Notes
			</Link>
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
			<button onClick={onClick} className='btn btn-info btn-sm'>
				New {helpers.docTypeName(docType)}
				<i className='fas fa_inline fa-plus-square'></i>
			</button>
		</div>
	</div>

// Fairly abstracted

export const EditorCancelButton = ({onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-secondary btn-sm' data-bs-dismiss='modal'>
		Cancel
		<i className='fas fa_inline fa-times'></i>
	</button>

export const EditorSubmitButton = ({onClick}) =>
	<button id='editor_submit' onClick={onClick} type='button' className='btn btn-primary btn-sm'>
		Submit
		<i className='fas fa_inline fa-check-square-o'></i>
	</button>

export const EditorDeleteButton = ({onClick}) =>
	<button id='editor_delete' onClick={onClick} type='button' data-bs-dismiss='modal' className='btn btn-outline-danger btn-sm'>
		Delete
		<i className='fas fa_inline fa-trash'></i>
	</button>





// Logout

export const LogoutButton = ({onClick}) =>
	<button id='admin_signout_button' onClick={onClick} type='button' className='btn btn-outline-danger'>
		Logout
	</button>

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

EditorCancelButton.propTypes = {
	onClick: PropTypes.func,
}

EditorSubmitButton.propTypes = {
	onClick: PropTypes.func,
}

EditorDeleteButton.propTypes = {
	onClick: PropTypes.func,
}