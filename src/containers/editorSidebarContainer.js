import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../actions'
import { DocumentList } from '../components/list'
import { NewDocumentButton } from '../components/button'
import { DocTypeDropdown } from '../components/dropdown'
import SidebarSpacer from '../components/sidebarSpacer'
import helpers from '../modules/helpers'

const EditorSidebar = ({
	chapters,
	notes,
	tags,
	media,
	docType,
	currentDocument,
	onDocumentClick,
	onNewDocumentClick,
	setDocType,
}) =>
	<div id='sidebar' className='col-md-3 d-none d-md-block'>
		<div>
			<DocTypeDropdown docType={docType} setDocType={setDocType} />
			<SidebarSpacer />
			<NewDocumentButton onClick={()=>onNewDocumentClick(docType)} docType={docType}/>
			<SidebarSpacer />
			<DocumentList docs={helpers.documentsOfDocType(docType, chapters, notes, tags, media)} currentDocument={currentDocument} onDocumentClick={onDocumentClick} docType={docType} path={'/edit/'}/>
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
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setDocType: docType => {
			dispatch(actions.setEditorDocType(docType))
		},
		onNewDocumentClick: docType => {
			dispatch(actions.createNewDocument(docType))
		},
		onDocumentClick: (id, docType) => {
			dispatch(actions.setCurrentDocument(id, docType))
		},
	}
}

EditorSidebar.propTypes = {
	chapters: PropTypes.arrayOf(PropTypes.object),
	notes: PropTypes.arrayOf(PropTypes.object),
	tags: PropTypes.arrayOf(PropTypes.object),
	media: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	docType: PropTypes.string,
	onDocumentClick: PropTypes.func,
	onNewDocumentClick: PropTypes.func,
	setDocType: PropTypes.func,
}

const EditorSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(EditorSidebar)

export default EditorSidebarContainer