import React from 'react'
import PropTypes from 'prop-types'

import romanize from '../modules/romanize'

const DocumentTitle = ({docType, currentDocument}) =>
	<h4>
		{docType === 'chapters' &&
			currentDocument.number ? romanize(currentDocument.number) + '. ' : ''
		}
		{currentDocument.title ? currentDocument.title : ''}		
	</h4>

DocumentTitle.propTypes = {
	docType: PropTypes.string,
	currentDocument: PropTypes.object
}

export default DocumentTitle