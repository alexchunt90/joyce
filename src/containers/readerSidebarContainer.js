import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import { HighlightButton } from '../components/button'
import PaginationReaderButton from '../components/paginationReaderButton'
import SidebarSpacer from '../components/sidebarSpacer'
import helpers from '../modules/helpers'

const ReaderSidebar = ({
	chapters,
	notes,
	editions,
	currentDocument,
	docType,
	toggles,
	onDocumentClick,
	onHighlightClick,
	onPaginationToggle,
	setPaginationEdition,
}) =>
	<div id='sidebar' className='col-md-3 d-none d-md-block'>
		<div>
			<HighlightButton toggle={toggles.highlights} onClick={onHighlightClick}/>
			<SidebarSpacer />
			<PaginationReaderButton toggle={toggles.pagination} editions={editions} onPaginationToggle={onPaginationToggle} setPaginationEdition={setPaginationEdition}/>
			<SidebarSpacer />
			<DocumentList docs={helpers.documentsOfDocType(docType, chapters, notes)} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType}/>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		editions: state.editions,
		currentDocument: state.currentDocument,		
		docType: state.docType,
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
		setPaginationEdition: (edition) => {
			dispatch(actions.setPaginationEdition(edition))
		}
	}
}

ReaderSidebar.propTypes = {
	chapters: PropTypes.arrayOf(PropTypes.object),
	notes: PropTypes.arrayOf(PropTypes.object),
	editions: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	docType: PropTypes.string,	
	toggles: PropTypes.object,
	onDocumentClick: PropTypes.func,
	onHighlightClick: PropTypes.func,
	onPaginationClick: PropTypes.func,
	setPaginationEdition: PropTypes.func,
}

const ReaderSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderSidebar)

export default ReaderSidebarContainer