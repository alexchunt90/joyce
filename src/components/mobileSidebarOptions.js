import React from 'react'
import PropTypes from 'prop-types'

import { HighlightButton } from './button'
import { ReaderDocDropdown } from './dropdown'

export const ReaderSidebarOptions = ({docs, currentDocument, highlightToggle, docType, onHighlightClick, onDocumentClick}) =>
	<div id='mobile_reader_sidebar' className='row'>
		<div className='col-6 d-block d-md-none'>
			<HighlightButton toggle={highlightToggle} onClick={onHighlightClick} size='md'/>
		</div>
		<div className='col-6 d-block d-md-none'>
			<ReaderDocDropdown currentDocument={currentDocument} docs={docs} docType={docType} onDocumentClick={onDocumentClick}/>
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