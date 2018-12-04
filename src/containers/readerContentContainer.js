import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const ReaderContent = ({
	currentDocument,
	editorState,
	toggles,
}) =>
	<div id="page" className={toggles.highlights ? 'annotations' : 'hidden_annotations'}>
		{toggles.loading === true &&
			<LoadingSpinner />
		}
		<br />
		<br />
		<DocumentTitle docType={'chapters'} currentDocument={currentDocument} />
		<br />
		<br />
		<Editor editorState={editorState} readOnly={true} />
		<br />
		<br />		
	</div>

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		toggles: state.toggles,
	}
}

ReaderContent.propTypes = {
	currentDocument: PropTypes.object,
	editorState: PropTypes.object,
	toggles: PropTypes.object,
}

const ReaderContentContainer = connect(mapStateToProps)(ReaderContent)

export default ReaderContentContainer