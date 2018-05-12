import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const ReaderContent = ({
	currentDocument,
	editorState,
	loadingToggle,
	highlightToggle,
}) =>
	<div id="page" className={highlightToggle ? 'annotations' : 'hidden_annotations'}>
		{loadingToggle === true &&
			<LoadingSpinner />
		}
		<br />
		<br />
		<DocumentTitle docType={'chapters'} currentDocument={currentDocument} />
		<br />
		<br />
		<Editor editorState={editorState} readOnly={true} />
	</div>

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		highlightToggle: state.highlightToggle,
		loadingToggle: state.loadingToggle
	}
}

ReaderContent.propTypes = {
	currentDocument: PropTypes.object,
	editorState: PropTypes.object,
	loadingToggle: PropTypes.bool,
	highlightToggle: PropTypes.bool,
}

const ReaderContentContainer = connect(mapStateToProps)(ReaderContent)

export default ReaderContentContainer