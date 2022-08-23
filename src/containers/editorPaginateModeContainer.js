import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock } from '../components/editorContentBlock'
import { EditorEditModeRichTextOptions, EditorSubmitOptions, EditorAnnotateOptions } from '../components/editorOptionBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import TagColorPicker from '../components/tagColorPicker'
import LoadingSpinner from '../components/loadingSpinner'

const EditorPaginateMode = ({
	currentDocument,
	editorState,
	docType,
	inputs,
	onChangeEditorState,
	paginateKeyBindings,
	cancelEdit,
	onSubmitClick,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper'>
		<EditorTitleContentBlock>
			<DocumentTitle 
				docType={docType} 
				currentDocument={currentDocument} 
			/>
		</EditorTitleContentBlock>

		<EditorTextContentBlock>
			<TextEditor 
				editorState={editorState} 
				onChange={onChangeEditorState} 
				keyBindingFn={paginateKeyBindings} 
			/>
		</EditorTextContentBlock>

		<EditorBottomBarContentBlock>
			<EditorSubmitOptions 
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)} 
			/>
		</EditorBottomBarContentBlock>	
	</div>

const mapStateToProps = (state, props) => {
	return {
		currentDocument: state.currentDocument,
		docType: state.docType,
		editorState: state.editorState,
		inputs: state.inputs,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		paginateKeyBindings: () => {
			// Prevents editor input in Annotation Mode
			return 'handled'
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		}		
	}
}

const EditorPaginateModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorPaginateMode)	

export default EditorPaginateModeContainer