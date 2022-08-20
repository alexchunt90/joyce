import React from 'react'
import PropTypes from 'prop-types'

import helpers from '../modules/helpers'
import TagColorPreview from './tagColorPreview'

export const DocTypeDropdown = ({docType, setDocType, size='sm'}) =>
	<div className='dropdown'>
		<button className={'btn btn-primary dropdown-toggle btn-' + size} type='button' id='doc_type_select' data-toggle='dropdown'>
			{docType.charAt(0).toUpperCase() + docType.slice(1)}
		</button>
		<div className='dropdown-menu'>
			<a className='dropdown-item' onClick={()=>setDocType('chapters')}>Chapters</a>
			<a className='dropdown-item' onClick={()=>setDocType('notes')}>Notes</a>
			<a className='dropdown-item' onClick={()=>setDocType('tags')}>Tags</a>
			<a className='dropdown-item' onClick={()=>setDocType('media')}>Media</a>
			<a className='dropdown-item' onClick={()=>setDocType('editions')}>Editions</a>
		</div>
	</div>

export const DocListDropdown = ({currentDocument, docs, docType, onDocumentClick, editMode=false, onNewDocumentClick}) =>
	<div className='dropdown'>
		<button className='btn btn-primary btn-md dropdown-toggle' type='button' id='doc_type_select' data-toggle='dropdown'>
			{docType==='chapters' && currentDocument.number ? currentDocument.number + '. ' : ''}{currentDocument.title}
		</button>
		<div id='doc_list_dropdown' className='dropdown-menu'>
	    	{docs.map(doc =>
				<a key={doc.id} className='dropdown-item' onClick={()=>onDocumentClick(doc.id, docType)}>
					{docType==='tags' &&
						<TagColorPreview color={doc.color}/>
					}
					{docType==='chapters' ? doc.number + '. ' : ''}
					{doc.title}
				</a>
	    	)}
	    	{editMode=true &&
	    		<a className='dropdown-item' onClick={onNewDocumentClick}>
					<i className='fas fa-plus-square'></i>&nbsp;
					New {helpers.docTypeName(docType)}
	    		</a>
	    	}
		</div>
	</div>

DocTypeDropdown.propTypes = {
	docType: PropTypes.string,
	setDocType: PropTypes.func
}