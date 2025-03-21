import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'
import { connect } from 'react-redux'

import { TextEditorReadOnly } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock } from '../components/editorContentBlock'
import { EditorReadModeOptions } from '../components/editorOptionBlock'
import { Image, ImageGroup, YoutubeEmbed } from '../components/image'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'

const EditorReadMode = ({
	currentDocument,
	editorState,
	annotationNoteMedia,
	docType,
	toggles,
	setMode
}) =>
	<div id='editor_read_mode'  className='editor_wrapper d-flex flex-column'>
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
		{docType === 'media' && currentDocument.type === 'img' &&
			<Image document={currentDocument}/>
		}
		{docType === 'media' && currentDocument.type === 'yt' &&
			<YoutubeEmbed document={currentDocument}/>
		}
		<EditorTextContentBlock>
			<TextEditorReadOnly 
				editorState={editorState}
				noteMedia={annotationNoteMedia}
				docType={docType}

			/>
		</EditorTextContentBlock>
	</div>

const mapStateToProps = (state, props) => {
	return {
		currentDocument: state.currentDocument,
		editorState: state.editorState,
		annotationNoteMedia: state.annotationNoteMedia,
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