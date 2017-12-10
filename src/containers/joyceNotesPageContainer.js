import React from 'react'
import { connect } from 'react-redux'
import { EditorState, Entity, CompositeDecorator } from 'draft-js'

import { deleteCurrentNote, submitAnnotation, selectAnnotationNote} from '../actions'
import Navbar from '../components/navbar'
import Content from '../components/content'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotateModal from '../components/annotateModal'
import JoyceNotesSidebarContainer from '../containers/joyceNotesSidebarContainer'
import JoyceNotesContentContainer from '../containers/joyceNotesContentContainer'

const JoyceNotesPage = ({notes, currentNote, annotationNote, onDeleteClick, onSubmitClick, selectAnnotationNote, selectionState, editorState}) =>
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
		<AnnotateModal notes={notes} annotationNote={annotationNote} onSubmitClick={()=>onSubmitClick(annotationNote, selectionState, editorState)} selectAnnotationNote={selectAnnotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		currentNote: state.currentNote,
		annotationNote: state.annotationNote,
		selectionState: state.selectionState,
		editorState: state.editorState
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onDeleteClick: id => {
			dispatch(deleteCurrentNote(id))
		},
		selectAnnotationNote: id => {
			dispatch(selectAnnotationNote(id))
		},
		onSubmitClick: (annotationNote, selectionState, editorState) => {
			dispatch(submitAnnotation(annotationNote, selectionState, editorState))
		}
	}
}

const JoyceNotesPageContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceNotesPage)

export default JoyceNotesPageContainer