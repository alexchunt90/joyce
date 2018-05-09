import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import { NewDocumentButton } from '../components/button'
import { DocTypeDropdown } from '../components/dropdown'
import SidebarSpacer from '../components/sidebarSpacer'
import { push } from 'react-router-redux'

const JoyceEditorSidebar = ({notes, chapters, docType, currentDocument, onDocumentClick, onNewDocumentClick, setDocType}) =>
	<div className="col-md-3 d-none d-md-block" id="sidebar">
		<div>
			<DocTypeDropdown docType={docType} setDocType={setDocType} />
			<SidebarSpacer />
			<NewDocumentButton onClick={()=>onNewDocumentClick(docType)} docType={docType}/>
			<SidebarSpacer />
			<DocumentList notes={notes} chapters={chapters} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType} path={'/edit/'}/>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		notes: state.notes,
		chapters: state.chapters,
		docType: state.docType,
		currentDocument: state.currentDocument,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setDocType: docType => {
			dispatch(actions.setDocType(docType))
		},
		onNewDocumentClick: docType => {
			dispatch(actions.createNewDocument(docType))
		},		
		onDocumentClick: (id, docType) => {
			dispatch(actions.setCurrentDocument(id, docType))
		},
	}
}

const JoyceEditorSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceEditorSidebar)

export default JoyceEditorSidebarContainer