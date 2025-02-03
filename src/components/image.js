import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import {blockStyleFn, blockRenderFn} from '../modules/editorSettings'
import editorConstructor from '../modules/editorConstructor'

export const Image = ({document, col=12}) =>
	<div className={'image_div col-md-'+col}>
		<a href={'/static/img/'+document.id+'/img.'+document.file_ext} target='_blank'>
			<img src={'/static/img/'+document.id+'/thumb.'+document.file_ext} />
		</a>
	</div>

export const YoutubeEmbed = ({document, col=12}) =>
	<div className={'youtube_div col-md-'+col}>
		<iframe src={document.youtube_url} allowFullScreen>
		</iframe>
	</div>

export const ImageGroup = ({media_docs}) =>
	<div className='image_group'>
    	{media_docs.map(doc =>
    		<div key={doc.id}>
    			{doc.type === 'img' &&
    				<Image document={doc} col={6} />
    			}
    			{doc.type === 'yt' &&
    				<YoutubeEmbed document={doc} col={6} />
    			}    			
    			{doc.html_source &&
    				<div className='image_caption'>
    					<Editor editorState={editorConstructor.returnEditorStateFromHTML(doc.html_source)} blockStyleFn={blockStyleFn} blockRendererFn={blockRenderFn} readOnly={true} />
    				</div>
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