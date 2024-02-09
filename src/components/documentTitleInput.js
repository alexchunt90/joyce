import React from 'react'
import PropTypes from 'prop-types'

const DocumentTitleInput = ({input, onChange}) =>
	<div className="input-group mb-3">
		<span className="input-group-text" id="basic-addon1">Title:</span>
		<input type="text" className="form-control" value={input} onChange={onChange} placeholder='Document Title'/>
	</div>

DocumentTitleInput.propTypes = {
	docType: PropTypes.string,
	currentDocument: PropTypes.object
}

export default DocumentTitleInput