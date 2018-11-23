import React from 'react'
import PropTypes from 'prop-types'

const TagColorPreview = ({color}) =>
	<div className='tag_button_color_preview' style={{backgroundColor: '#' + color }}>
	</div>

export default TagColorPreview

TagColorPreview.propTypes = {
	color: PropTypes.string,
}