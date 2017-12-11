import React from 'react'
import { connect } from 'react-redux'
import { EditorState, Entity, CompositeDecorator } from 'draft-js'

import { deleteCurrentDocument, submitAnnotation, selectAnnotationNote } from '../actions'
import Navbar from '../components/navbar'
import Content from '../components/content'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotateModal from '../components/annotateModal'
import JoyceDocumentsSidebarContainer from '../containers/joyceDocumentsSidebarContainer'
import JoyceDocumentsContentContainer from '../containers/joyceDocumentsContentContainer'

const JoyceDocumentsPage = ({notes, currentDocument, docType, annotationNote, onDeleteClick, onSubmitAnnotationClick, selectAnnotationNote, selectionState, editorState}) =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceDocumentsSidebarContainer />
				<Content>
					<JoyceDocumentsContentContainer />
				</Content>
			</div>
		</div>
		<DeleteConfirmModal onDeleteClick={()=>onDeleteClick(currentDocument.id, docType)}/>
		<AnnotateModal notes={notes} annotationNote={annotationNote} onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, selectionState, editorState)} selectAnnotationNote={selectAnnotationNote} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		docType: state.docType,
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote,
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

const JoyceDocumentsPageContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceDocumentsPage)

export default JoyceDocumentsPageContainer