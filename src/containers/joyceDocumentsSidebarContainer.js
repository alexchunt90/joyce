import React from 'react'
import { connect } from 'react-redux'
import { setCurrentDocument, createNewDocument } from '../actions'
import { DocumentList } from '../components/list'
import { NewDocumentButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const JoyceDocumentsSidebar = ({notes, chapters, docType, currentDocument, onDocumentClick, onNewDocumentClick}) =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<NewDocumentButton onClick={()=>onNewDocumentClick(docType)} docType={docType}/>
		<SidebarSpacer />
		<DocumentList notes={notes} chapters={chapters} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType} />
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		chapters: state.chapters,
		docType: state.docType,
		currentDocument: state.currentDocument
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onNewDocumentClick: docType => {
			dispatch(createNewDocument(docType))
		},		
		onDocumentClick: (id, docType) => {
			dispatch(setCurrentDocument(id, docType))
		},
	}
}

const JoyceDocumentsSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceDocumentsSidebar)

export default JoyceDocumentsSidebarContainer