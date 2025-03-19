import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Navigate, matchPath } from 'react-router-dom'

import Content from '../components/content'
import actions from '../actions'
import helpers from '../modules/helpers'
import { ReaderWelcome } from '../components/welcome'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderSidebarContainer from '../containers/readerSidebarContainer'
import ReaderContentContainer from '../containers/readerContentContainer'
import AnnotationModal from '../components/annotationModal'
import { ReaderSidebarOptions } from '../components/mobileSidebarOptions'
import LicenseDisclaimer from '../components/licenseDisclaimer'

// TODO: ReaderSidebar being a container while mobile sidebar options take props from ReaderPage container
// 		 creates a lot of redunancy. DRY this up by making mobile sidebar a container?

const ReaderPage = ({
	chapters,
	notes,
	info,
	tags,
	editions,
	currentDocument, 
	docType,
	annotationNote,
	annotationNoteMedia,
	modalEditorState,
	toggles,
	onDocumentClick,
	onHighlightClick,
	onPaginationToggle,
	choosePaginationEdition,
}) =>
	<div id='joyce_page' className='container-fluid'>
		{matchPath('/', location.pathname) &&
			<Navigate to=':id'/>
		}
		{matchPath('notes', location.pathname) &&
			<Navigate to=':id'/>
		}
		<div id='page_wrapper' className='row'>
			<ReaderSidebarContainer />
			<Content>
				<ReaderSidebarOptions
					docs={helpers.documentsOfDocType(docType, chapters, notes, tags, editions, undefined, info)}
					editions={editions}
					currentDocument={currentDocument}
					toggles={toggles}
					docType={docType}
					onHighlightClick={onHighlightClick}
					onDocumentClick={onDocumentClick}
					onPaginationToggle={onPaginationToggle}
					choosePaginationEdition={choosePaginationEdition}
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
				{toggles.loading === false &&
					<LicenseDisclaimer location={'footer'}/>
				}				
			</Content>
		</div>
		<AnnotationModal annotationNote={annotationNote} annotationNoteMedia={annotationNoteMedia} modalEditorState={modalEditorState} />
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		info: state.info,
		tags: state.tags,
		editions: state.editions,
		currentDocument: state.currentDocument,
		docType: state.docType,
		annotationNote: state.annotationNote,
		annotationNoteMedia: state.annotationNoteMedia,
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
		},
		onPaginationToggle: () => {
			dispatch(actions.togglePagination())
		},
		choosePaginationEdition: (edition) => {
			dispatch(actions.choosePaginationEdition(edition))
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
	annotationNoteMedia: PropTypes.arrayOf(PropTypes.object),
	modalEditorState: PropTypes.object, 
	toggles: PropTypes.object,
	onPaginationClick: PropTypes.func,
	setPaginationEdition: PropTypes.func,
}

const ReaderPageContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderPage)

export default ReaderPageContainer