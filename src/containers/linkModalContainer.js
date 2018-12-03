// Same as LinkContainer but w/o modal-toggle attributes
// TODO: Dry this up later
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const ModalLink = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a href='#' 
    		onClick={()=>props.onAnnotationClick(data['url'])}
    		style={{color: '#' + data['data-color']}}
    		data-color={data['data-color']}
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
			dispatch(actions.selectAnnotationNote(id))
		}
	}
}

ModalLink.propTypes = {
	onAnnotationClick: PropTypes.func,
}

const ModalLinkContainer = connect(mapStateToProps, mapDispatchToProps)(ModalLink)

export default ModalLinkContainer