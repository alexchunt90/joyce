import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { setCurrentChapter, setAnnotationNote } from '../actions'
import DocumentTitle from '../components/documentTitle'

const JoyceReaderContent = ({currentDocument, highlightActive, editorState}) =>
	<div id="page" className={highlightActive ? 'annotations' : 'hidden_annotations'}>
		<DocumentTitle docType={'chapters'} currentDocument={currentDocument} />
		<Editor editorState={editorState} readOnly={true} />
	</div>			

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		highlightActive: state.highlightActive,
		editorState: state.editorState
	}
}

const JoyceReaderContentContainer = connect(mapStateToProps)(JoyceReaderContent)

export default JoyceReaderContentContainer