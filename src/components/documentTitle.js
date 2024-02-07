import React from 'react'
import PropTypes from 'prop-types'

const DocumentTitle = ({docType, currentDocument}) =>
	<h4>
		{currentDocument.title ? currentDocument.title : ''}		
	</h4>

DocumentTitle.propTypes = {
	docType: PropTypes.string,
	currentDocument: PropTypes.object
}

export default DocumentTitle