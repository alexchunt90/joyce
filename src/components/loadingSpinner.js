import React from 'react'

const LoadingSpinner = ({size=2}) =>
	<div className='loading_spinner'>
		<i className={'fa fa-cog fa-spin fa-' + size + 'x fa-fw'}></i>
	</div>

export default LoadingSpinner