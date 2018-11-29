import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'

import Content from '../components/content'
import actions from '../actions'
import helpers from '../modules/helpers'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderSidebarContainer from '../containers/readerSidebarContainer'
import ReaderContentContainer from '../containers/readerContentContainer'
import AnnotationModal from '../components/annotationModal'
import { ReaderSidebarOptions } from '../components/mobileSidebarOptions'

const ReaderPage = ({
	chapters,
	notes,
	tags,
	currentDocument, 
	docType,
	annotationNote,
	modalEditorState,
	loadingToggle,
	highlightToggle,
	onDocumentClick,
	onHighlightClick,
}) =>
	<div id='joyce_reader' className='container-fluid'>
		<ReaderSidebarOptions
			docs={helpers.documentsOfDocType(docType, chapters, notes, tags)}
			currentDocument={currentDocument}
			highlightToggle={highlightToggle}
			docType={docType}
			onHighlightClick={onHighlightClick}
			onDocumentClick={onDocumentClick}
		/>
		<div id='content_container' className='row'>
			<ReaderSidebarContainer />
			<Content>
				{loadingToggle === true &&
					<LoadingSpinner size={4} />
				}
				{(Object.keys(currentDocument).length > 0 && loadingToggle === false) &&
					<ReaderContentContainer />
				}
				{(Object.keys(currentDocument).length === 0 && loadingToggle === false) &&
					<ReaderWelcome />
				}				
			</Content>
		</div>
		<AnnotationModal annotationNote={annotationNote} modalEditorState={modalEditorState} />
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		tags: state.tags,
		currentDocument: state.currentDocument,
		docType: state.docType,
		annotationNote: state.annotationNote,
		modalEditorState: state.modalEditorState,
		loadingToggle: state.loadingToggle,
		highlightToggle: state.highlightToggle,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onDocumentClick: (id, docType) => {
			dispatch(actions.setCurrentDocument(id, docType))
		},
		onHighlightClick: () => {
			dispatch(actions.toggleHighlight())
		}		
	}
}

ReaderPage.propTypes = {
	currentDocument: PropTypes.object,
	modalEditorState: PropTypes.object, 
	annotationNote: PropTypes.object,
	loadingToggle: PropTypes.bool,
}

const ReaderPageContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderPage)

export default ReaderPageContainer