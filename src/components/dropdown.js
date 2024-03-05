import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import helpers from '../modules/helpers'
import TagColorPreview from './tagColorPreview'
import FilterInput from './filterInput'

export const DocTypeDropdown = ({docType, setDocType, size='sm'}) =>
	<div className='dropdown'>
		<button className={'btn btn-primary dropdown-toggle btn-' + size} type='button' id='doc_type_select' data-bs-toggle='dropdown'>
			{docType.charAt(0).toUpperCase() + docType.slice(1)}
		</button>
		<div className='dropdown-menu'>
			<a className='dropdown-item' onClick={()=>setDocType('chapters')}>Chapters</a>
			<a className='dropdown-item' onClick={()=>setDocType('notes')}>Notes</a>
			<a className='dropdown-item' onClick={()=>setDocType('tags')}>Tags</a>
			<a className='dropdown-item' onClick={()=>setDocType('media')}>Media</a>
			<a className='dropdown-item' onClick={()=>setDocType('editions')}>Editions</a>
			<a className='dropdown-item' onClick={()=>setDocType('info')}>Info Pages</a>
		</div>
	</div>

export const DocListDropdown = ({currentDocument, docs, docType, onDocumentClick, editMode=false, onNewDocumentClick, theme='primary'}) => {
	const filterInputText = useSelector((state) => state.inputs.filterInput).toLowerCase()
	let filteredDocArray = docs

	if (filterInputText !== '') {			
		filteredDocArray = filteredDocArray.filter((doc) => {
			if (typeof doc.title === 'string') {
				const docTitle = doc.title.toLowerCase()
				return docTitle.includes(filterInputText)
			} else {return false}
		})
	}		

	return (
		<div className='dropdown'>
			<button className={'btn btn-' + theme +' btn-md dropdown-toggle'} type='button' id='doc_type_select' data-bs-toggle='dropdown'>
				{currentDocument.title}
			</button>
			<div id='doc_list_dropdown' className='dropdown-menu'>
				{docType === 'notes' &&
					<FilterInput />
				}
		    	{filteredDocArray.map(doc =>
					<a key={doc.id} className='dropdown-item' onClick={()=>onDocumentClick(doc.id, docType)}>
						{docType==='tags' &&
							<TagColorPreview color={doc.color}/>
						}
						{docType==='chapters' ? doc.number + '. ' : ''}
						{doc.title}
					</a>
		    	)}
		    	{editMode===true &&
		    		<a className='dropdown-item' onClick={onNewDocumentClick}>
						<i className='fas fa-plus-square'></i>&nbsp;
						New {helpers.docTypeName(docType)}
		    		</a>
		    	}
			</div>
		</div>
	)
}

DocTypeDropdown.propTypes = {
	docType: PropTypes.string,
	setDocType: PropTypes.func
}