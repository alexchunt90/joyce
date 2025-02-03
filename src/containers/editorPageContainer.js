import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Navigate, matchPath } from 'react-router-dom'

import actions from '../actions'
import helpers from '../modules/helpers'
import Content from '../components/content'
import { EditorWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import EditorSidebarContainer from './editorSidebarContainer'
import EditorContentContainer from './editorContentContainer'
import DeleteConfirmModal from '../components/deleteConfirmModal'
import AnnotationModal from '../components/annotationModal'
import ExternalURLModal from '../components/externalURLModal'
import ChooseAnnotationModal from '../components/chooseAnnotationModal'
import { EditorSidebarOptions } from '../components/mobileSidebarOptions'

const EditorPage = ({
	chapters,
	notes,
	info,
	tags,
	editions,
	media,
	currentDocument,
	inputs,
	annotationNote,
	annotationNoteMedia,
	annotationTag,
	editorState,
	modalEditorState,
	docType,
	mode,
	toggles,
	setDocType,
	onDocumentClick,
	onNewDocumentClick,
	onDeleteConfirm,
	onURLInputChange,
	onURLModalSubmit,
	onSubmitAnnotationClick,
	selectAnnotationNote,
	selectAnnotationTag,
	clearAnnotationTag,
	selectionState,
	userErrors,
}) =>
	<div id='joyce_page' className='container-fluid'>
		{matchPath('edit', location.pathname) &&
			<Navigate to=':id'/>
		}
		<div id='page_wrapper' className="row">
			<EditorSidebarContainer />
			<Content>
				{mode === 'READ_MODE' &&
					<EditorSidebarOptions
						docs={helpers.documentsOfDocType(docType, chapters, notes, tags, editions, media, info)}
						currentDocument={currentDocument}
						docType={docType}
						setDocType={setDocType}
						onDocumentClick={onDocumentClick}
						onNewDocumentClick={()=>onNewDocumentClick(docType)}
					/>
				}
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
		<AnnotationModal annotationNote={annotationNote} annotationNoteMedia={annotationNoteMedia} modalEditorState={modalEditorState} />
		<ExternalURLModal externalURLInput={inputs.externalURL} onInputChange={onURLInputChange} onSubmitClick={()=>onURLModalSubmit(inputs.externalURL, editorState)}/>
		<ChooseAnnotationModal 
			notes={notes}
			tags={tags}
			annotationNote={annotationNote} 
			annotationTag={annotationTag}
			modalEditorState={modalEditorState}
			onSubmitClick={()=>onSubmitAnnotationClick(annotationNote, annotationTag, selectionState, editorState, docType)} 
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
		info: state.info,
		tags: state.tags,
		editions: state.editions,
		media: state.media,
		mode: state.mode,
		currentDocument: state.currentDocument,
		inputs: state.inputs,
		annotationNote: state.annotationNote,
		annotationNoteMedia: state.annotationNoteMedia,
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
		onURLInputChange: input => {
			dispatch(actions.updateExternalURLInput(input))
		},
		onURLModalSubmit: (externalURL, editorState) => {
			dispatch(actions.submitExternalURL(externalURL, editorState))
		},
		onSubmitAnnotationClick: (annotationNote, annotationTag, selectionState, editorState, docType) => {
			dispatch(actions.submitAnnotation(annotationNote, annotationTag, selectionState, editorState, docType))
		}
	}
}

EditorPage.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	tags: PropTypes.arrayOf(PropTypes.object),
	editions: PropTypes.arrayOf(PropTypes.object),
	media: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	annotationNote: PropTypes.object,
	annotationNoteMedia: PropTypes.arrayOf(PropTypes.object),
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