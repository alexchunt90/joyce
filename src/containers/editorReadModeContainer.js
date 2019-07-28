import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'
import { connect } from 'react-redux'

import { TextEditorReadOnly } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock } from '../components/editorContentBlock'
import { EditorReadModeOptions } from '../components/editorOptionBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'

const EditorReadMode = ({
	currentDocument,
	editorState,
	docType,
	toggles,
	setMode
}) =>
	<div id='editor_read_mode'  className='editor_wrapper'>
		<EditorTitleContentBlock>
			<DocumentTitle 
				docType={docType} 
				currentDocument={currentDocument} 
			/>
		</EditorTitleContentBlock>
		<EditorTopBarContentBlock>
			<EditorReadModeOptions 
				setMode={setMode} 
				docType={docType} 
			/>
		</EditorTopBarContentBlock>
		<EditorTextContentBlock>
			<TextEditorReadOnly 
				editorState={editorState}
			/>
		</EditorTextContentBlock>
	</div>

const mapStateToProps = (state, props) => {
	return {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		docType: state.docType,
		toggles: state.toggles,
		mode: state.mode,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setMode: (mode) => {
			dispatch(actions.setMode(mode))
		},
	}
}

const EditorReadModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorReadMode)

export default EditorReadModeContainer