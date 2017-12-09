import React from 'react'
import { connect } from 'react-redux'

import { deleteCurrentNote } from '../actions'
import Navbar from '../components/navbar'
import Content from '../components/content'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import JoyceNotesSidebarContainer from '../containers/joyceNotesSidebarContainer'
import JoyceNotesContentContainer from '../containers/joyceNotesContentContainer'

const JoyceNotesPage = ({currentNote, onDeleteClick}) =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceNotesSidebarContainer />
				<Content>
					<JoyceNotesContentContainer />
				</Content>
			</div>
		</div>
		<DeleteConfirmModal onDeleteClick={()=>onDeleteClick(currentNote.id)}/>
	</div>

const mapStateToProps = state => {
	return {
		currentNote: state.currentNote
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onDeleteClick: id => {
			dispatch(deleteCurrentNote(id))
		}
	}
}

const JoyceNotesPageContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceNotesPage)

export default JoyceNotesPageContainer