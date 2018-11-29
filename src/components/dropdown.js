import React from 'react'
import PropTypes from 'prop-types'

export const DocTypeDropdown = ({docType, setDocType}) =>
	<div className='dropdown'>
		<button className='btn btn-primary btn-sm dropdown-toggle' type='button' id='doc_type_select' data-toggle='dropdown'>
			{docType.charAt(0).toUpperCase() + docType.slice(1)}
		</button>
		<div className='dropdown-menu'>
			<a className='dropdown-item' onClick={()=>setDocType('chapters')}>Chapters</a>
			<a className='dropdown-item' onClick={()=>setDocType('notes')}>Notes</a>
			<a className='dropdown-item' onClick={()=>setDocType('tags')}>Tags</a>
		</div>
	</div>

export const ReaderDocDropdown = ({currentDocument, docs, docType, onDocumentClick}) =>
	<div className='dropdown'>
		<button className='btn btn-primary btn-md dropdown-toggle' type='button' id='doc_type_select' data-toggle='dropdown'>
			{docType=='chapters' && currentDocument.number ? currentDocument.number + '. ' : ''}{currentDocument.title}
		</button>
		<div className='dropdown-menu'>
	    	{docs.map(doc =>
				<a key={doc.id} className='dropdown-item' onClick={()=>onDocumentClick(doc.id, docType)}>{docType=='chapters' ? doc.number + '. ' : ''}{doc.title}</a>
	    	)}				
		</div>
	</div>

DocTypeDropdown.propTypes = {
	docType: PropTypes.string,
	setDocType: PropTypes.func
}