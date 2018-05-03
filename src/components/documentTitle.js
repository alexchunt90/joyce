import React from 'react'
import romanize from '../modules/romanize'

const DocumentTitle = ({docType, currentDocument}) =>
	<h4>
		{docType === 'chapters' &&
			currentDocument.number ? romanize(currentDocument.number) + '. ' : ''
		}
		{currentDocument.title ? currentDocument.title : ''}		
	</h4>

export default DocumentTitle