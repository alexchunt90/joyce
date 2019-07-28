import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import { HighlightButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'
import helpers from '../modules/helpers'

const ReaderSidebar = ({
	chapters,
	notes,
	currentDocument,
	docType,
	toggles,
	onDocumentClick,
	onHighlightClick,
}) =>
	<div id='sidebar' className='col-md-3 d-none d-md-block'>
		<div>
			<HighlightButton toggle={toggles.highlights} onClick={onHighlightClick}/>
			<SidebarSpacer />
			<DocumentList docs={helpers.documentsOfDocType(docType, chapters, notes)} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType}/>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		chapters: state.chapters,
		tags: state.tags,
		media: state.media,
		docType: state.docType,
		currentDocument: state.currentDocument,
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

ReaderSidebar.propTypes = {
	chapters: PropTypes.arrayOf(PropTypes.object),
	notes: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	docType: PropTypes.string,	
	toggles: PropTypes.object,
	onDocumentClick: PropTypes.func,
	onHighlightClick: PropTypes.func,
}

const ReaderSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderSidebar)

export default ReaderSidebarContainer