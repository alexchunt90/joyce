import React from 'react'
import { connect } from 'react-redux'
import { setCurrentChapter, setAnnotationNote } from '../actions'
import DocumentTitle from '../components/documentTitle'

const JoyceReaderContent = ({currentDocument, highlightActive}) =>
	<div id="page" className={highlightActive ? 'show_notes' : 'hide_notes'}>
		<DocumentTitle docType={'chapters'} currentDocument={currentDocument} />
		<div dangerouslySetInnerHTML={{__html: currentDocument.text}} />
	</div>			

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		highlightActive: state.highlightActive
	}
}

const JoyceReaderContentContainer = connect(mapStateToProps)(JoyceReaderContent)

export default JoyceReaderContentContainer