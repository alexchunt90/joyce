import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'
import helpers from '../modules/helpers'
import Content from '../components/content'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import EditorSidebarContainer from './editorSidebarContainer'
import EditorContentContainer from './editorContentContainer'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotationModal from '../components/annotationModal'
import ChooseAnnotationModal from '../components/chooseAnnotationModal'
import { EditorSidebarOptions } from '../components/mobileSidebarOptions'

const EditorPage = ({
	chapters,
	notes,
	currentDocument,
	annotationNote,
	annotationTag,
	editorState,
	modalEditorState,
	docType,
	tags,
	toggles,
	setDocType,
	onDocumentClick,
	onNewDocumentClick,
	onDeleteConfirm,
	onSubmitAnnotationClick,
	selectAnnotationNote,
	selectAnnotationTag,
	clearAnnotationTag,
	selectionState,
	userErrors,
}) =>
	<div id='joyce_reader' className='container-fluid'>
		<div id='content_container' className="row">
			<EditorSidebarContainer />
			<Content>
				<EditorSidebarOptions
					docs={helpers.documentsOfDocType(docType, chapters, notes, tags)}
					currentDocument={currentDocument}
					docType={docType}
					setDocType={setDocType}
					onDocumentClick={onDocumentClick}
					onNewDocumentClick={()=>onNewDocumentClick(docType)}
				/>				
				{toggles.loading === true &&
					<LoadingSpinner size={4} />
				}
				{(Object.keys(currentDocument).length > 0 && toggles.loading === false) &&
					<EditorContentContainer />
				}
				{(Object.keys(currentDocument).length === 0 && toggles.loading === false) &&
					<EditorWelcome />
				}					
			</Content>
		</div>
		<DeleteConfirmModal onDeleteConfirm={()=>onDeleteConfirm(currentDocument.id, docType)}/>
		<AnnotationModal annotationNote={annotationNote} modalEditorState={modalEditorState} />
		<ChooseAnnotationModal 
			notes={notes}
			tags={tags}
			annotationNote={annotationNote} 
			annotationTag={annotationTag}
			modalEditorState={modalEditorState}
			onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, annotationTag, selectionState, editorState)} 
			selectAnnotationNote={selectAnnotationNote} 
			selectAnnotationTag={selectAnnotationTag}
			clearAnnotationTag={clearAnnotationTag}
			userErrors={userErrors}
		/>
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		tags: state.tags,
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote,
		annotationTag: state.annotationTag,
		editorState: state.editorState,
		modalEditorState: state.modalEditorState,
		selectionState: state.selectionState,
		docType: state.docType,
		toggles: state.toggles,
		userErrors: state.userErrors,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setDocType: docType => {
			dispatch(actions.setEditorDocType(docType))
		},
		onNewDocumentClick: docType => {
			dispatch(actions.createNewDocument(docType))
		},		
		onDocumentClick: (id, docType) => {
			dispatch(actions.setCurrentDocument(id, docType))
		},
		onDeleteConfirm: (id, docType) => {
			dispatch(actions.deleteCurrentDocument(id, docType))
		},
		selectAnnotationNote: id => {
			dispatch(actions.selectAnnotationNote(id))
		},
		clearAnnotationTag: () => {
			dispatch(actions.clearAnnotationTag())
		},
		selectAnnotationTag: tag => {
			dispatch(actions.selectAnnotationTag(tag))
		},

		onSubmitAnnotationClick: (annotationNote, annotationTag, selectionState, editorState) => {
			dispatch(actions.submitAnnotation(annotationNote, annotationTag, selectionState, editorState))
		}
	}
}

EditorPage.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	tags: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	annotationNote: PropTypes.object,
	annotationTag: PropTypes.object,
	editorState: PropTypes.object,
	modalEditorState: PropTypes.object,
	selectionState: PropTypes.object,
	docType: PropTypes.string,
	toggles: PropTypes.object,
	onDeleteConfirm: PropTypes.func,
	onSubmitAnnotationClick: PropTypes.func,
	selectAnnotationNote: PropTypes.func,
	selectAnnotationTag: PropTypes.func,
}

const EditorPageContainer = connect(mapStateToProps, mapDispatchToProps)(EditorPage)

export default EditorPageContainer