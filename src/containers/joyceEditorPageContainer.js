import React from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import { deleteCurrentDocument, submitAnnotation, selectAnnotationNote } from '../actions/userActions'
import Navbar from '../components/navbar'
import Content from '../components/content'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotateModal from '../components/annotateModal'
import AnnotationModal from '../components/annotationModal'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import JoyceEditorSidebarContainer from '../containers/joyceEditorSidebarContainer'
import JoyceEditorContentContainer from '../containers/joyceEditorContentContainer'

const JoyceEditorPage = ({notes, currentDocument, docType, annotationNote, onDeleteClick, onSubmitAnnotationClick, selectAnnotationNote, selectionState, editorState, loadingToggle}) =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceEditorSidebarContainer />
				<Content>
					{loadingToggle === true &&
						<LoadingSpinner size={4} />
					}
					{(Object.keys(currentDocument).length > 0 && loadingToggle === false) &&
						<JoyceEditorContentContainer />
					}
					{(Object.keys(currentDocument).length === 0 && loadingToggle === false) &&
						<EditorWelcome />
					}					
				</Content>
			</div>
		</div>
		<DeleteConfirmModal onDeleteClick={()=>onDeleteClick(currentDocument.id, docType)}/>
		<AnnotateModal notes={notes} annotationNote={annotationNote} onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, selectionState, editorState)} selectAnnotationNote={selectAnnotationNote} />
		<AnnotationModal annotationNote={annotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		docType: state.docType,
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote,
		loadingToggle: state.loadingToggle,
		selectionState: state.selectionState,
		editorState: state.editorState
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onDeleteClick: (id, docType) => {
			dispatch(deleteCurrentDocument(id, docType))
		},
		selectAnnotationNote: id => {
			dispatch(selectAnnotationNote(id))
		},
		onSubmitAnnotationClick: (annotationNote, selectionState, editorState) => {
			dispatch(submitAnnotation(annotationNote, selectionState, editorState))
		}
	}
}

const JoyceEditorPageContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceEditorPage)

export default JoyceEditorPageContainer