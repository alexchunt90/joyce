import React from 'react'
import PropTypes from 'prop-types'

const DocumentTitleInput = ({titleInput, numberInput, onTitleChange, onNumberChange, docType}) =>
	<div className='input-group mb-3'>
		<span className='input-group-text' id='basic-addon1'>Title:</span>
		<input value={titleInput} onChange={onTitleChange} type='text' className='form-control' placeholder='Document Title'/>
		{docType === 'info' &&
			<input value={numberInput} onChange={onNumberChange} type='text' className='form-control' placeholder='#' />
		}
	</div>

DocumentTitleInput.propTypes = {
	docType: PropTypes.string,
	currentDocument: PropTypes.object
}

export default DocumentTitleInput