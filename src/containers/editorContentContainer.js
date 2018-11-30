import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'
import EditorReadMode from '../components/editorReadMode'
import EditorAnnotateMode from '../components/editorAnnotateMode'
import EditorEditMode from '../components/editorEditMode'

const EditorContent = ({
	// State
	currentDocument,
	editorState,
	docType,
	mode,
	toggles,
	inputs,
	userErrors,
	//Dispatch
	handleKeyCommand,
	onChangeEditorState,
	onToolButtonClick,
	setMode,
	cancelEdit,
	onSubmitClick,
	onColorSwatchClick,
	onDocumentTitleChange,
	onColorPickerInputChange,
	onNewAnnotationClick,
	annotateKeyBindings,
	onRemoveAnnotationClick,
}) =>
	<div id='editor_container'>
		{mode === 'READ_MODE' &&
			<EditorReadMode 
				currentDocument={currentDocument} 
				editorState={editorState} 
				docType={docType}
				toggles={toggles} 
				setMode={setMode} 
			/>
		}
		{mode === 'ANNOTATE_MODE' &&
			<EditorAnnotateMode 
				currentDocument={currentDocument} 
				editorState={editorState}	
				docType={docType} 
				toggles={toggles} 
				handleKeyCommand={handleKeyCommand}	
				onNewAnnotationClick={()=>onNewAnnotationClick(editorState.getSelection())}
				onRemoveAnnotationClick={()=>onRemoveAnnotationClick(editorState)}
				annotateKeyBindings={annotateKeyBindings}
				onChangeEditorState={onChangeEditorState} 
				onToolButtonClick={onToolButtonClick} 
				setMode={setMode}
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)}	
			/>
		}
		{mode === 'EDIT_MODE' &&
			<EditorEditMode 
				currentDocument={currentDocument}
				editorState={editorState}
				docType={docType}
				toggles={toggles}
				onChangeEditorState={onChangeEditorState}
				cancelEdit={cancelEdit}
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)}
				inputs={inputs}
				onColorSwatchClick={onColorSwatchClick}
				onDocumentTitleChange={onDocumentTitleChange}
				onColorPickerInputChange={onColorPickerInputChange}
				userErrors={userErrors}
			/>
		}
	</div>	

const mapStateToProps = (state, props) => {
	return {
		currentDocument: state.currentDocument,
		mode: state.mode,
		docType: state.docType,
		editorState: state.editorState,
		inputs: state.inputs,
		toggles: state.toggles,
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
		annotateKeyBindings: () => {
			// Prevents editor input in Annotation Mode
			return 'handled'
		},
		setMode: (mode) => {
			dispatch(actions.setMode(mode))
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onColorSwatchClick: (color) => {
			dispatch(actions.selectColorSwatch(color))
		},
		onNewAnnotationClick: (selectionState) => {
			dispatch(actions.addAnnotation(selectionState))
		},
		onRemoveAnnotationClick: (editorState) => {
			dispatch(actions.removeAnnotation(editorState))
		},
		onToolButtonClick: (editorState, style) => {
			dispatch(actions.applyInlineStyles(editorState, style))
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		}		
	}
}

EditorContent.propTypes = {
	currentDocument: PropTypes.object,
	editorState: PropTypes.object,
	inputs: PropTypes.object,
	docType: PropTypes.string,
	mode: PropTypes.string,
	toggles: PropTypes.object,
	handleKeyCommand: PropTypes.func,
	onChangeEditorState: PropTypes.func,
	onToolButtonClick: PropTypes.func,
	setMode: PropTypes.func,
	cancelEdit: PropTypes.func,
	onSubmitClick: PropTypes.func,
	onDocumentTitleChange: PropTypes.func,
	onNewAnnotationClick: PropTypes.func,
	annotateKeyBindings: PropTypes.func,
	onRemoveAnnotationClick: PropTypes.func,
}

const EditorContentContainer = connect(mapStateToProps, mapDispatchToProps)(EditorContent)

export default EditorContentContainer