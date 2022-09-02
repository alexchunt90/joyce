import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'
import ReaderPageButtons from '../components/readerPageButtons'

const ReaderContent = ({
	currentDocument,
	editorState,
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
		<br />
		<br />

		{toggles.pagination === false &&
			<div>
				<DocumentTitle docType={'chapters'} currentDocument={currentDocument} />
				<br />
				<br />
				<Editor editorState={editorState} readOnly={true} />
			</div>
		}
		{toggles.pagination === true &&
			<div>
				<div className='paginated_reader_content'>
					<Editor editorState={paginationEditorState} readOnly={true} />
				</div>
				<ReaderPageButtons pagesArray={pagesArray} currentPageNumber={currentPageNumber} setPageNumber={setPageNumber}/>
			</div>
		}

		<br />
		<br />		
	</div>

const mapStateToProps = state => {
	const baseState = {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		toggles: state.toggles,
		paginationEditorState: undefined,
		currentPageNumber: undefined,
		pagesArray: undefined,
	}
	const paginationState = state.paginationState
	if (paginationState.paginationEdition) {
		const currentPage = paginationState.currentPage
		const paginationEdition = paginationState.paginationEdition
		const currentPaginatedDoc = paginationState.documents[paginationEdition.year]
		const pagesArray = currentPaginatedDoc.doc.map(p => p.number)
		const hydratedState = {
			...baseState,
			paginationEditorState: paginationState.editorState,
			currentPageNumber: currentPage,
			pagesArray: pagesArray,
		}
		return hydratedState
	} else {
		return baseState
	}
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