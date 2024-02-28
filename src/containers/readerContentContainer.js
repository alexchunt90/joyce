import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import actions from '../actions'
import { blockStyleFn, blockRenderFn } from '../modules/editorSettings'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderPageButtons from '../components/readerPageButtons'
import NoteTallySummary from '../components/noteTallySummary'
import NoteIndexSummary from '../components/noteIndexSummary'
import ColorCodingSummary from '../components/colorCodingSummary'
import {infoPageTitleConstants} from '../config'

const ReaderContent = ({
	currentDocument,
	notes,
	tags,
	editorState,
	docType,
	paginationEditorState,
	currentPageNumber,
	pagesArray,
	toggles,
	setPageNumber
}) =>
	<div id="reader_container" className={toggles.highlights ? 'annotations' : 'hidden_annotations'}>
		{toggles.loading === true &&
			<LoadingSpinner />
		}
		{docType !== 'chapters' &&
			<h2>{currentDocument.title}</h2>
		}
		<br />
		<br />


		{toggles.pagination === false &&
			<div>
				<Editor editorState={editorState} blockStyleFn={blockStyleFn} blockRendererFn={blockRenderFn} readOnly={true} />
			</div>
		}
		{toggles.pagination === true &&
			<div>
				<div className='paginated_reader_content'>
					<Editor editorState={paginationEditorState} blockStyleFn={blockStyleFn} blockRendererFn={blockRenderFn} readOnly={true} />
				</div>
				<ReaderPageButtons pagesArray={pagesArray} currentPageNumber={currentPageNumber} setPageNumber={setPageNumber}/>
			</div>
		}
		{currentDocument.title === infoPageTitleConstants.TALLY_INFO_PAGE_TITLE &&
			<NoteTallySummary noteCount={notes.length}/>
		}
		{currentDocument.title === infoPageTitleConstants.COLOR_CODING_INFO_PAGE_TITLE &&
			<ColorCodingSummary tags={tags} />
		}
		<br />
		<br />		
		{currentDocument.title === infoPageTitleConstants.NOTE_INDEX_INFO_PAGE_TITLE &&
			<NoteIndexSummary notes={notes} />
		}
	</div>

const mapStateToProps = state => {
	const baseState = {
		notes: state.notes,
		tags: state.tags,
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		docType: state.docType,
		toggles: state.toggles,
		paginationEditorState: undefined,
		currentPageNumber: undefined,
		pagesArray: undefined,
	}
	const paginationState = state.paginationState
	if (typeof paginationState.paginationEdition !== 'undefined') {
		const paginationEdition = paginationState.paginationEdition
		if (typeof paginationState.documents[paginationEdition.year] !== 'undefined') {
			const currentPage = paginationState.currentPage
			const currentPaginatedDoc = paginationState.documents[paginationEdition.year]
			const pagesArray = currentPaginatedDoc.doc.map(p => p.number)
			const hydratedState = {
				...baseState,
				paginationEditorState: paginationState.editorState,
				currentPageNumber: currentPage,
				pagesArray: pagesArray,
			}
			return hydratedState
		} else {return baseState}
	} else {return baseState}
	const currentPage = paginationState.currentPage
	const paginationEdition = paginationState.paginationEdition
	const currentPaginatedDoc = paginationState.documents[paginationEdition.year]
	const pagesArray = currentPaginatedDoc.doc.map(p => p.number)
	return {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		paginationEditorState: paginationState.editorState,
		currentPageNumber: currentPage,
		pagesArray: pagesArray,
		toggles: state.toggles,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setPageNumber: (number) => {
			dispatch(actions.setPageNumber(number))
		}
	}
}

ReaderContent.propTypes = {
	currentDocument: PropTypes.object,
	editorState: PropTypes.object,
	paginationState: PropTypes.object,
	toggles: PropTypes.object,
}

const ReaderContentContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderContent)

export default ReaderContentContainer