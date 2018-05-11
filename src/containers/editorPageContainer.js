import React from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import actions from '../actions'
import Content from '../components/content'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import EditorSidebarContainer from './editorSidebarContainer'
import EditorContentContainer from './editorContentContainer'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotateModal from '../components/annotateModal'

const EditorPage = ({notes, currentDocument, docType, annotationNote, onDeleteConfirm, onSubmitAnnotationClick, selectAnnotationNote, selectionState, editorState, loadingToggle}) =>
	<div id='joyce_reader' className='container-fluid'>
		<div className="row">
			<EditorSidebarContainer />
			<Content>
				{loadingToggle === true &&
					<LoadingSpinner size={4} />
				}
				{(Object.keys(currentDocument).length > 0 && loadingToggle === false) &&
					<EditorContentContainer />
				}
				{(Object.keys(currentDocument).length === 0 && loadingToggle === false) &&
					<EditorWelcome />
				}					
			</Content>
		</div>
		<DeleteConfirmModal onDeleteConfirm={()=>onDeleteConfirm(currentDocument.id, docType)}/>
		<AnnotateModal notes={notes} annotationNote={annotationNote} onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, selectionState, editorState)} selectAnnotationNote={selectAnnotationNote} />		
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
		onDeleteConfirm: (id, docType) => {
			dispatch(actions.deleteCurrentDocument(id, docType))
		},
		selectAnnotationNote: id => {
			dispatch(actions.selectAnnotationNote(id))
		},
		onSubmitAnnotationClick: (annotationNote, selectionState, editorState) => {
			dispatch(actions.submitAnnotation(annotationNote, selectionState, editorState))
		}
	}
}

const EditorPageContainer = connect(mapStateToProps, mapDispatchToProps)(EditorPage)

export default EditorPageContainer