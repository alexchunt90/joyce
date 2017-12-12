import React from 'react'
import { selectAnnotationNote } from '../actions'
import { connect } from 'react-redux'

const Link = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a href='#' className='hidden_annotations' onClick={()=>props.onAnnotationClick(data.url)} data-toggle='modal' data-target='#annotation_modal' data-url={data.url}>
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
			dispatch(selectAnnotationNote(id))
		}
	}
}

const LinkContainer = connect(mapStateToProps, mapDispatchToProps)(Link)

export default LinkContainer