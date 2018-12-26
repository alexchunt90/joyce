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
	toggles,
	onDocumentClick,
	onHighlightClick,
}) =>
	<div id='joyce_page' className='container-fluid'>
		<div id='page_wrapper' className='row'>
			<ReaderSidebarContainer />
			<Content>
				<ReaderSidebarOptions
					docs={helpers.documentsOfDocType(docType, chapters, notes, tags)}
					currentDocument={currentDocument}
					highlightToggle={toggles.highlights}
					docType={docType}
					onHighlightClick={onHighlightClick}
					onDocumentClick={onDocumentClick}
				/>			
				{toggles.loading === true &&
					<LoadingSpinner size={4} />
				}
				{(Object.keys(currentDocument).length > 0 && toggles.loading === false) &&
					<ReaderContentContainer />
				}
				{(Object.keys(currentDocument).length === 0 && toggles.loading === false) &&
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
		toggles: state.toggles,
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
	chapters: PropTypes.arrayOf(PropTypes.object),
	notes: PropTypes.arrayOf(PropTypes.object),
	tags: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	docType: PropTypes.string,
	annotationNote: PropTypes.object,
	modalEditorState: PropTypes.object, 
	toggles: PropTypes.object,
}

const ReaderPageContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderPage)

export default ReaderPageContainer