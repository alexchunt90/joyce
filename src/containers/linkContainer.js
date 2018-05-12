import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const Link = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a href='#' onClick={()=>props.onAnnotationClick(data.url)} data-toggle='modal' data-target='#annotation_modal' data-url={data.url}>
    		{props.children}
    	</a>
    )
}

const mapStateToProps = state => {
	return {
		annotationNote: state.annotationNote
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAnnotationClick: id => {
			dispatch(actions.selectAnnotationNote(id))
		}
	}
}

Link.propTypes = {
	annotationNote: PropTypes.object,
	onAnnotationClick: PropTypes.func,
}

const LinkContainer = connect(mapStateToProps, mapDispatchToProps)(Link)

export default LinkContainer