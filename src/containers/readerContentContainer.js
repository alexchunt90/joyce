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
import { ImageGroup } from '../components/image'
import PlacesPDF from '../components/placesPDF'
import {infoPageTitleConstants} from '../config'

const infoPageTitleArray = []
for (const constant in infoPageTitleConstants) {
	infoPageTitleArray.push(infoPageTitleConstants[constant])
}

const ReaderContent = ({
	currentDocument,
	notes,
	tags,
	editorState,
	readerNoteMedia,
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
		{currentDocument.title === 'Places' &&
			<PlacesPDF />
		}
		<br />


		{toggles.pagination === false &&
			<div className={docType + '_reader col-12'}>
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

		{docType === 'notes' && readerNoteMedia.length >= 1 && !infoPageTitleArray.includes(currentDocument.title) && 
			<ImageGroup media_docs={readerNoteMedia} />
		}

		{/* These two info pages are the only reader content derived from the note corpus,
		    and the list now arrives after the document rather than at boot. Spin rather
		    than render a count of 0 or an empty index for the moment in between. */}
		{currentDocument.title === infoPageTitleConstants.TALLY_INFO_PAGE_TITLE &&
			(notes.length > 0
				? <NoteTallySummary noteCount={notes.length}/>
				: <LoadingSpinner />)
		}
		{currentDocument.title === infoPageTitleConstants.COLOR_CODING_INFO_PAGE_TITLE &&
			<ColorCodingSummary tags={tags} />
		}
		<br />
		<br />		
		{currentDocument.title === infoPageTitleConstants.NOTE_INDEX_INFO_PAGE_TITLE &&
			(notes.length > 0
				? <NoteIndexSummary notes={notes} />
				: <LoadingSpinner />)
		}
	</div>

const mapStateToProps = state => {
	const baseState = {
		notes: state.notes,
		tags: state.tags,
		currentDocument: state.currentDocument,
		readerNoteMedia: state.readerNoteMedia,
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