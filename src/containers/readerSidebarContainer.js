import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import { HighlightButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'
import { push } from 'react-router-redux'

const ReaderSidebar = ({
	chapters,
	notes,
	currentDocument,
	docType,
	highlightToggle,
	onDocumentClick,
	onHighlightClick,
}) =>
	<div className='col-md-3 d-none d-md-block' id='sidebar'>
		<div>
			<HighlightButton highlightToggle={highlightToggle} onClick={onHighlightClick}/>
			<SidebarSpacer />
			<DocumentList chapters={chapters} notes={notes} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType}/>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		notes: state.notes,
		docType: state.docType,
		currentDocument: state.currentDocument,
		highlightToggle: state.highlightToggle
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
	highlightToggle: PropTypes.bool,
	onDocumentClick: PropTypes.func,
	onHighlightClick: PropTypes.func,
}

const ReaderSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderSidebar)

export default ReaderSidebarContainer