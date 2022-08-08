import React from 'react'
import PropTypes from 'prop-types'

export const Image = ({document}) =>
	<div className='image_div col-md-12'>
		<img src={'/static/img/'+document.id+'/img.'+document.file_ext} />
	</div>

Image.propTypes = {
	currentDocument: PropTypes.object
}