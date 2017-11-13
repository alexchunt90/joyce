import React from 'react'
import { connect } from 'react-redux'

import { createNewChapter } from '../actions'

import NewChapterButton from '../components/newChapterButton'

const mapDispatchToProps = dispatch => {
	return {
		onNewChapterClick: () => {
			dispatch(createNewChapter())
		}
	}
}

const NewChapterButtonContainer = connect(mapDispatchToProps)(NewChapterButton)

export default NewChapterButtonContainer