import React from 'react'
import { connect } from 'react-redux'
import { setCurrentNote, createNewNote } from '../actions'
import { NoteList } from '../components/list'
import { NewNoteButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const JoyceNotesSidebar = ({notes, currentNote, onNoteClick, onNewNoteClick}) =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<NewNoteButton onClick={()=>onNewNoteClick()}/>
		<SidebarSpacer />
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
		onNewNoteClick: () => {
			dispatch(createNewNote())
		},		
		onNoteClick: id => {
			dispatch(setCurrentNote(id))
		},
	}
}

const JoyceNotesSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceNotesSidebar)

export default JoyceNotesSidebarContainer