import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import actions from '../actions'
import Content from '../components/content'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import EditorSidebarContainer from './editorSidebarContainer'
import EditorContentContainer from './editorContentContainer'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotationModal from '../components/annotationModal'
import ChooseAnnotationModal from '../components/chooseAnnotationModal'

const EditorPage = ({
	notes,
	currentDocument,
	annotationNote,
	annotationTag,
	editorState,
	docType,
	tags,
	loadingToggle,
	onDeleteConfirm,
	onSubmitAnnotationClick,
	selectAnnotationNote,
	selectAnnotationTag,
	clearAnnotationTag,
	selectionState,
	userErrors,
}) =>
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
		<AnnotationModal annotationNote={annotationNote}/>
		<ChooseAnnotationModal 
			notes={notes}
			tags={tags}
			annotationNote={annotationNote} 
			annotationTag={annotationTag} 
			onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, annotationTag, selectionState, editorState)} 
			selectAnnotationNote={selectAnnotationNote} 
			selectAnnotationTag={selectAnnotationTag}
			clearAnnotationTag={clearAnnotationTag}
			userErrors={userErrors}
		/>
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		tags: state.tags,
		currentDocument: state.currentDocument,
		annotationNote: state.annotationNote,
		annotationTag: state.annotationTag,
		editorState: state.editorState,
		selectionState: state.selectionState,
		docType: state.docType,
		loadingToggle: state.loadingToggle,
		userErrors: state.userErrors,
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
	selectionState: PropTypes.object,
	docType: PropTypes.string,
	loadingToggle: PropTypes.bool,
	onDeleteConfirm: PropTypes.func,
	onSubmitAnnotationClick: PropTypes.func,
	selectAnnotationNote: PropTypes.func,
	selectAnnotationTag: PropTypes.func,
}

const EditorPageContainer = connect(mapStateToProps, mapDispatchToProps)(EditorPage)

export default EditorPageContainer