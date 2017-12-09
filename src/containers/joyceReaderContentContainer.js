import React from 'react'
import { connect } from 'react-redux'
import { setCurrentChapter } from '../actions'

const JoyceReaderContent = ({currentChapter, highlightActive}) =>
	<div id="page" className={highlightActive ? 'show_notes' : 'hide_notes'}>
		<div dangerouslySetInnerHTML={{__html: currentChapter.text}} />
	</div>			

const mapStateToProps = state => {
	return {
		currentChapter: state.currentChapter,
		highlightActive: state.highlightActive
	}
}

const JoyceReaderContentContainer = connect(mapStateToProps)(JoyceReaderContent)

export default JoyceReaderContentContainer