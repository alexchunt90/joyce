import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const Link = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a href='#' 
    		onClick={()=>props.onAnnotationClick(data['url'])}
    		style={{color: '#' + data['color']}}
    		data-bs-toggle='modal'
    		data-bs-target='#annotation_modal'
    		data-color={data['color']}
    		data-url={data['url']}
		>
    		{props.children}
    	</a>
    )
}

const mapStateToProps = state => {
	return {}
}

const mapDispatchToProps = dispatch => {
	return {
		onAnnotationClick: id => {
			console.log('id is:')
			console.log(id)
			dispatch(actions.selectAnnotationNote(id))
		}
	}
}

Link.propTypes = {
	onAnnotationClick: PropTypes.func,
}

const LinkContainer = connect(mapStateToProps, mapDispatchToProps)(Link)

export default LinkContainer