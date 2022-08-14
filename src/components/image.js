import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import {returnEditorStateFromHTML, linkDecorator} from '../modules/editorSettings'

export const Image = ({document, col=12}) =>
	<div className={'image_div col-md-'+col}>
		<a href={'/static/img/'+document.id+'/img.'+document.file_ext} target='_blank'>
			<img src={'/static/img/'+document.id+'/img.'+document.file_ext} />
		</a>
	</div>

export const ImageGroup = ({media_docs}) =>
	<div>
    	{media_docs.map(doc =>
    		<div key={doc.id}>
    			<Image document={doc} col={6} />
    			<Editor editorState={returnEditorStateFromHTML(doc.html_source, linkDecorator)} readOnly={true} />
    		</div>
    	)}	
	</div>

Image.propTypes = {
	document: PropTypes.object,
	col: PropTypes.number
}

ImageGroup.propTypes = {
	media_docs: PropTypes.arrayOf(PropTypes.object)
}