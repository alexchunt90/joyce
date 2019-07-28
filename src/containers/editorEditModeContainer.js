import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock, EditorAttributeContentBlock } from '../components/editorContentBlock'
import { EditorEditModeRichTextOptions, EditorSubmitOptions } from '../components/editorOptionBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import TagColorPicker from '../components/tagColorPicker'
import LoadingSpinner from '../components/loadingSpinner'

const EditorEditMode = ({
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
	cancelEdit,
	onSubmitClick,
	onToolButtonClick,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper'>
		<EditorTitleContentBlock>
			<input 
				type='text' 
				value={inputs.documentTitle} 
				placeholder='Document Title' 
				onChange={onDocumentTitleChange}
			/>
		</EditorTitleContentBlock>
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
		<EditorAttributeContentBlock>
			{docType === 'tags' &&
				<TagColorPicker 
					input={inputs.colorPicker} 
					onChange={onColorPickerInputChange} 
					onColorSwatchClick={onColorSwatchClick}
				/>
			}
		</EditorAttributeContentBlock>
		<EditorBottomBarContentBlock>
			<EditorSubmitOptions 
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)} 
			/>
		</EditorBottomBarContentBlock>
		<div id='user_errors'>
			{userErrors.map(error =>
				<div key={error} className='user_error_message'>{error}</div>
			)}
		</div>		
	</div>

const mapStateToProps = (state, props) => {
	return {
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