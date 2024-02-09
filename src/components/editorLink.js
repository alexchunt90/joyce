import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const EditorLink = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a href='#' 
    		style={{color: '#' + data['color']}}
    		data-color={data['color']}
    		data-url={data['url']}
		>
    		{props.children}
    	</a>
    )
}

export default EditorLink