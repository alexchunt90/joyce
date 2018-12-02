import React from 'react'
import PropTypes from 'prop-types'

const LoadingSpinner = ({size=2}) =>
	<div className='loading_spinner'>
		<i className={'fas fa-cog fa-spin fa-' + size + 'x fa-fw'}></i>
	</div>

LoadingSpinner.propTypes = {
	size: PropTypes.number,
}

export default LoadingSpinner