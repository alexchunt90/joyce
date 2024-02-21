import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import {returnEditorStateFromHTML, blockStyleFn} from '../modules/editorSettings'

export const Image = ({document, col=12}) =>
	<div className={'image_div col-md-'+col}>
		<a href={'/static/img/'+document.id+'/img.'+document.file_ext} target='_blank'>
			<img src={'/static/img/'+document.id+'/img.'+document.file_ext} />
		</a>
	</div>

export const ImageGroup = ({media_docs}) =>
	<div className='image_group'>
    	{media_docs.map(doc =>
    		<div key={doc.id}>
    			<Image document={doc} col={6} />
    			{doc.html_source &&
    				<Editor editorState={returnEditorStateFromHTML(doc.html_source)} blockStyleFn={blockStyleFn} readOnly={true} />
    			}
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