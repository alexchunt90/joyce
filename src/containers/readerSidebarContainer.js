import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import Logo from '../components/logo'
import { HighlightButton, IndexNotesButton, TallyNotesButton } from '../components/button'
import PaginationReaderButton from '../components/paginationReaderButton'
import SidebarSpacer from '../components/sidebarSpacer'
import helpers from '../modules/helpers'

const ReaderSidebar = ({
	chapters,
	notes,
	info,
	media,
	editions,
	currentDocument,
	docType,
	toggles,
	onHighlightClick,
	onPaginationToggle,
	choosePaginationEdition,
	widthInt = 3,
}) =>
	<div id='sidebar' className='col-md-3 d-none d-md-flex'>
		<div>
			<Logo />
			<SidebarSpacer />
			{docType === 'notes' &&
				<IndexNotesButton />
			}
			{docType === 'notes' &&
				<SidebarSpacer />
			}			
			{docType === 'notes' &&
				<TallyNotesButton />
			}
			{docType === 'notes' &&
				<SidebarSpacer />
			}
			<HighlightButton toggle={toggles.highlights} onClick={onHighlightClick}/>
			<SidebarSpacer />
			{docType==='chapters' &&
				<PaginationReaderButton toggle={toggles.pagination} loading={toggles.loadingPagination} editions={editions} onPaginationToggle={onPaginationToggle} choosePaginationEdition={choosePaginationEdition}/>
			}
			{docType==='chapters' &&
				<SidebarSpacer />
			}			
			<DocumentList docs={helpers.documentsOfDocType(docType, chapters, notes, undefined, undefined, media, info)} currentDocument={currentDocument} docType={docType} basePath={'/'}/>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		info: state.info,
		media: state.media,
		editions: state.editions,
		currentDocument: state.currentDocument,		
		docType: state.docType,
		toggles: state.toggles,
	}
}

const mapDispatchToProps = dispatch => {
	return {
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