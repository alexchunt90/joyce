import React from 'react'
import PropTypes from 'prop-types'

import { DocTypeDropdown } from './dropdown'
import { HighlightButton } from './button'
import PaginationReaderButton from './paginationReaderButton'
import { DocListDropdown } from './dropdown'

export const ReaderSidebarOptions = ({docs, editions, currentDocument, toggles, docType, onHighlightClick, onDocumentClick, onPaginationToggle, setPaginationEdition}) =>
	<div id='mobile_reader_sidebar' className='mobile_sidebar row'>
		<div id='mobile_highlight_options' className='col-4 d-block d-md-none'>
			<HighlightButton toggle={toggles.highlights} onClick={onHighlightClick} size='md'/>
		</div>
		{docType === 'chapters' &&
			<div id='mobile_pagination_options' className='col-4 d-block d-md-none'>
				<PaginationReaderButton toggle={toggles.pagination} editions={editions} onPaginationToggle={onPaginationToggle} setPaginationEdition={setPaginationEdition}/>
			</div>
		}
		<div id='mobile_read_options' className='mobile_list_options col-4 d-block d-md-none'>
			<DocListDropdown currentDocument={currentDocument} docs={docs} docType={docType} editMode={false} onDocumentClick={onDocumentClick}/>
		</div>
	</div>

export const EditorSidebarOptions = ({docType, setDocType, currentDocument, docs, onDocumentClick, onNewDocumentClick}) =>
	<div id='mobile_editor_sidebar' className='mobile_sidebar row'>
		<div id='mobile_doctype_options' className='col-6 d-block d-md-none'>
			<DocTypeDropdown docType={docType} setDocType={setDocType} size='md'/>
		</div>
		<div id='mobile_edit_options' className='mobile_list_options col-6 d-block d-md-none'>
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
	onPaginationClick: PropTypes.func,
	setPaginationEdition: PropTypes.func,	
}