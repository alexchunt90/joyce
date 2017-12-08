import React from 'react'
import { connect } from 'react-redux'
import { setCurrentNote } from '../actions'
import { NoteList } from '../components/list'

const NoteSidebar = ({notes, currentNote, onNoteClick}) =>
	<div className="col-md-3" id="sidebar">
		<NoteList notes={notes} currentNote={currentNote} onNoteClick={onNoteClick} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		currentNote: state.currentNote
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onNoteClick: id => {
			dispatch(setCurrentNote(id))
		},
	}
}

const NoteSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(NoteSidebar)

export default NoteSidebarContainer