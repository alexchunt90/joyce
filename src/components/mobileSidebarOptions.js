import React from 'react'
import PropTypes from 'prop-types'

import { DocTypeDropdown } from './dropdown'
import { HighlightButton } from './button'
import { DocListDropdown } from './dropdown'

export const ReaderSidebarOptions = ({docs, currentDocument, highlightToggle, docType, onHighlightClick, onDocumentClick}) =>
	<div id='mobile_reader_sidebar' className='mobile_sidebar row'>
		<div className='col-6 d-block d-md-none'>
			<HighlightButton toggle={highlightToggle} onClick={onHighlightClick} size='md'/>
		</div>
		<div className='col-6 d-block d-md-none'>
			<DocListDropdown currentDocument={currentDocument} docs={docs} docType={docType} onDocumentClick={onDocumentClick}/>
		</div>
	</div>

export const EditorSidebarOptions = ({docType, setDocType, currentDocument, docs, onDocumentClick, onNewDocumentClick}) =>
	<div id='mobile_editor_sidebar' className='mobile_sidebar row'>
		<div className='col-6 d-block d-md-none'>
			<DocTypeDropdown docType={docType} setDocType={setDocType} size='md'/>
		</div>
		<div className='col-6 d-block d-md-none'>
			<DocListDropdown currentDocument={currentDocument} docs={docs} docType={docType} onDocumentClick={onDocumentClick} editMode={true} onNewDocumentClick={onNewDocumentClick}/>
		</div>
	</div>

ReaderSidebarOptions.propTypes = {
	docs: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	docType: PropTypes.string,
	highlightToggle: PropTypes.bool,
	onHighlightClick: PropTypes.func,
	onDocumentClick: PropTypes.func,
}