import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

export const PageBreak = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<span
    		style={{display: 'none'}}
    		data-edition={data['edition']}
    		data-page={data['pageNumber']}
		>
    		{props.children}
    	</span>
    )
}

export const VisiblePageBreak = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<span
    		style={{backgroundColor: '#6edbc0'}}
    		data-edition={data['edition']}
    		data-page={data['pageNumber']}
		>
    		{props.children}
    	</span>
    )
}