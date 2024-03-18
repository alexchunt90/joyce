import React from 'react'

const Content = (props) =>
	<div id='content_wrapper' className='d-flex col-md-9 order-2 order-xs-1 order-md-2'>
		{props.children}
	</div>

export default Content