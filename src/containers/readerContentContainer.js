import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const ReaderContent = ({currentDocument, highlightToggle, editorState, loadingToggle}) =>
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

const ReaderContentContainer = connect(mapStateToProps)(ReaderContent)

export default ReaderContentContainer