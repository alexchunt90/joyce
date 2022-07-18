import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock, EditorAttributeContentBlock } from '../components/editorContentBlock'
import { EditorEditModeRichTextOptions, EditorSubmitOptions } from '../components/editorOptionBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import DocumentTitleInput from '../components/documentTitleInput'
import TagColorPicker from '../components/tagColorPicker'
import NoteMediaPicker from '../components/noteMediaPicker'
import MediaUploadInput from '../components/mediaUploadInput'
import LoadingSpinner from '../components/loadingSpinner'

const EditorEditMode = ({
	media,
	currentDocument,
	docType,
	editorState,
	inputs,
	userErrors,
	handleKeyCommand,
	onChangeEditorState,
	onDocumentTitleChange,
	onColorPickerInputChange,
	onColorSwatchClick,
	onClearLoadedMedia,
	onMediaInputChange,
	onMediaUpload,
	cancelEdit,
	onSubmitClick,
	onToolButtonClick,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper'>
		{/* Doc Title */}
		<EditorTitleContentBlock>
			<DocumentTitleInput
				input={inputs.documentTitle}
				onChange={onDocumentTitleChange}
			/>
		</EditorTitleContentBlock>
		{/* Topbar with rich text options */}
		<EditorTopBarContentBlock>
			<EditorEditModeRichTextOptions 
				editorState={editorState} 
				onToolButtonClick={onToolButtonClick} 
				disabled={!currentDocument.id ? true : false}
			/>
		</EditorTopBarContentBlock>
		<EditorTextContentBlock>
			<TextEditor 
				editorState={editorState} 
				handleKeyCommand={handleKeyCommand} 
				onChange={onChangeEditorState} 
			/>
		</EditorTextContentBlock>
		{/* Dropdown select for attaching media or tags */}
		<EditorAttributeContentBlock>
			{docType === 'notes' &&
				<NoteMediaPicker media={media} />
			}
			{docType === 'tags' &&
				<TagColorPicker 
					input={inputs.colorPicker} 
					onChange={onColorPickerInputChange} 
					onColorSwatchClick={onColorSwatchClick}
				/>
			}
			{docType === 'media' && inputs.s3Path &&
				<div className='row'>
					<div className='col-8'>File uploaded!</div>					
					<div className='col-2 offset-2'>
						<button type='button' onClick={onClearLoadedMedia} className='btn btn-outline-info btn-sm'>
							<i className={'fas fa-trash-alt'}></i>
						</button>
					</div>
				</div>
			}
			{docType === 'media' && !inputs.s3Path &&
					<MediaUploadInput input={inputs.uploadFile} onChange={onMediaInputChange} onUpload={onMediaUpload}/>
			}					
		</EditorAttributeContentBlock>
		{/* Cancel and Submit buttons */}
		<EditorBottomBarContentBlock>
			<EditorSubmitOptions 
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)} 
			/>
		{/* Display errors to user */}
		</EditorBottomBarContentBlock>
		<div id='user_errors'>
			{userErrors.map(error =>
				<div key={error} className='user_error_message'>{error}</div>
			)}
		</div>		
	</div>

const mapStateToProps = (state, props) => {
	return {
		media: state.media,
		currentDocument: state.currentDocument,
		docType: state.docType,
		editorState: state.editorState,
		inputs: state.inputs,
		userErrors: state.userErrors,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		onDocumentTitleChange: input => {
			dispatch(actions.updateDocumentTitleInput(input))
		},
		onColorPickerInputChange: input => {
			dispatch(actions.updateColorPickerInput(input))
		},
		handleKeyCommand: (command, editorState) => {
			dispatch(actions.handleEditorKeyCommand(editorState, command))
		},
		onMediaInputChange: input => {
			dispatch(actions.updateMediaInput(input))
		},
		onMediaUpload: input => {
			dispatch(actions.uploadMediaInput(input))
		},
		onClearLoadedMedia: () => {
			dispatch(actions.clearLoadedMedia())
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onColorSwatchClick: (color) => {
			dispatch(actions.selectColorSwatch(color))
		},
		onToolButtonClick: (editorState, style) => {
			dispatch(actions.applyInlineStyles(editorState, style))
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		}		
	}
}

const EditorEditModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorEditMode)	

export default EditorEditModeContainer