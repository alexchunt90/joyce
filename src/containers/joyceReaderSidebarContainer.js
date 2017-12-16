import React from 'react'
import { connect } from 'react-redux'
import { setCurrentDocument, toggleHighlight } from '../actions'
import { DocumentList } from '../components/list'
import { HighlightButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const JoyceReaderSidebar = ({chapters, currentDocument, onDocumentClick, highlightToggle, onHighlightClick, docType}) =>
	<div className='col-md-3 order-1 order-xs-2 order-sm-2' id='sidebar'>
		<div className='d-none d-md-block'>
			<SidebarSpacer />
			<HighlightButton highlightToggle={highlightToggle} onHighlightClick={onHighlightClick}/>
			<SidebarSpacer />
			<DocumentList chapters={chapters} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType} />
		</div>
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		docType: state.docType,
		currentDocument: state.currentDocument,
		highlightToggle: state.highlightToggle
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onDocumentClick: (id, docType) => {
			dispatch(setCurrentDocument(id, docType))
		},
		onHighlightClick: () => {
			dispatch(toggleHighlight())
		}		
	}
}

const JoyceReaderSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceReaderSidebar)

export default JoyceReaderSidebarContainer