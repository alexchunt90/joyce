import React from 'react'
import { connect } from 'react-redux'

const NotePage = ({currentNote}) =>
	<div id='page'>
		<div dangerouslySetInnerHTML={{__html: currentNote.text}} />
	</div>			

const mapStateToProps = state => {
	return {
		currentNote: state.currentNote
	}
}

const NotePageContainer = connect(mapStateToProps)(NotePage)

export default NotePageContainer