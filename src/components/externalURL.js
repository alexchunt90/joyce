import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'

const ExternalURL = (props) => {
	const data = props.contentState.getEntity(props.entityKey).getData()
    return (
    	<a 
    		href={data['url']}
    		className='external_url_tag'
    		target='_blank'
    	>
    		{props.children}
    	</a>
    )
}

export default ExternalURL