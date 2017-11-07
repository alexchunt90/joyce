import React from 'react'
import { connect } from 'react-redux'

import { toggleHighlight } from '../actions/actions'

import HighlightButton from '../components/highlightButton'

const mapStateToProps = state => {
	return {
		highlightActive: state.highlightActive
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onHighlightClick: () => {
			dispatch(toggleHighlight())
		}
	}
}

const HighlightButtonContainer = connect(mapStateToProps, mapDispatchToProps)(HighlightButton)

export default HighlightButtonContainer