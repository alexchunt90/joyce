import React from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import actions from '../actions'
import Content from '../components/content'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import JoyceEditorSidebarContainer from '../containers/joyceEditorSidebarContainer'
import JoyceEditorContentContainer from '../containers/joyceEditorContentContainer'

const JoyceEditorPage = ({notes, currentDocument, docType, annotationNote, onDeleteClick, onSubmitAnnotationClick, selectAnnotationNote, selectionState, editorState, loadingToggle}) =>
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

const JoyceEditorPageContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceEditorPage)

export default JoyceEditorPageContainer