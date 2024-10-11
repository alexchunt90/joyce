import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock } from '../components/editorContentBlock'
import { EditorSubmitOptions } from '../components/editorOptionBlock'
import EditorAnnotateOptions from '../components/editorAnnotateOptionsBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import TagColorPicker from '../components/tagColorPicker'
import LoadingSpinner from '../components/loadingSpinner'

const EditorAnnotateMode = ({
	currentDocument,
	editorState,
	docType,
	toggles,
	inputs,
	onChangeEditorState,
	onNewAnnotationClick,
	annotateKeyBindings,
	onRemoveAnnotationClick,
	cancelEdit,
	onSubmitClick,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper d-flex flex-column'>
		<EditorTitleContentBlock>
			<DocumentTitle 
				docType={docType} 
				currentDocument={currentDocument} 
			/>
		</EditorTitleContentBlock>
		<EditorTopBarContentBlock>
			<EditorAnnotateOptions 
				onNewAnnotationClick={()=>onNewAnnotationClick(editorState.getSelection())}
				onRemoveAnnotationClick={()=>onRemoveAnnotationClick(editorState)}
				addDisabled={editorState.getSelection().isCollapsed() ? true : false}
				removeDisabled={(editorState.getSelection().isCollapsed() ) ? true : false}
			/>
		</EditorTopBarContentBlock>
		<EditorTextContentBlock>
			<TextEditor 
				editorState={editorState}
				docType={docType}
				onChange={onChangeEditorState} 
				keyBindingFn={annotateKeyBindings} 
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
		toggles: state.toggles,
		inputs: state.inputs,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		annotateKeyBindings: () => {
			// Prevents editor input in Annotation Mode
			return 'handled'
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onNewAnnotationClick: (selectionState) => {
			dispatch(actions.addAnnotation(selectionState))
		},
		onRemoveAnnotationClick: (editorState) => {
			dispatch(actions.removeAnnotation(editorState))
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		}		
	}
}

const EditorAnnotateModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorAnnotateMode)	

export default EditorAnnotateModeContainer