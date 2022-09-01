import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const PageBreak = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<span
    		style={{display: 'none'}}
    		data-edition={data['edition']}
    		data-page={data['pageNumber']}
		>
    		{data['pageNumber']} {props.children}
    	</span>
    )
}

// PageBreak.propTypes = {
// 	onAnnotationClick: PropTypes.func,
// }

// const PageBreakContainer = connect(mapStateToProps, mapDispatchToProps)(PageBreak)

export default PageBreak