import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../actions'
import EditorReadMode from '../components/editorReadMode'
import EditorAnnotateMode from '../components/editorAnnotateMode'
import EditorEditMode from '../components/editorEditMode'

const EditorContent = ({
	currentDocument,
	editorState,
	docType,
	mode,
	loadingToggle,
	handleKeyCommand,
	onChangeEditorState,
	onToolButtonClick,
	setMode,
	cancelEdit,
	onSubmitClick,
	onColorSwatchClick,
	documentTitleInput,
	colorPickerInput,
	onDocumentTitleChange,
	onColorPickerInputChange,
	onNewAnnotationClick,
	annotateKeyBindings,
	onRemoveAnnotationClick,
	userErrors,
}) =>
	<div id='editor_container'>
		{mode === 'READ_MODE' &&
			<EditorReadMode 
				currentDocument={currentDocument} 
				editorState={editorState} 
				docType={docType}
				loadingToggle={loadingToggle} 
				setMode={setMode} 
			/>
		}
		{mode === 'ANNOTATE_MODE' &&
			<EditorAnnotateMode 
				currentDocument={currentDocument} 
				editorState={editorState}	
				docType={docType} 
				loadingToggle={loadingToggle} 
				handleKeyCommand={handleKeyCommand}	
				onNewAnnotationClick={()=>onNewAnnotationClick(editorState.getSelection())}
				onRemoveAnnotationClick={()=>onRemoveAnnotationClick(editorState)}
				annotateKeyBindings={annotateKeyBindings}
				onChangeEditorState={onChangeEditorState} 
				onToolButtonClick={onToolButtonClick} 
				setMode={setMode}
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, documentTitleInput, colorPickerInput, docType)}	
			/>
		}
		{mode === 'EDIT_MODE' &&
			<EditorEditMode 
				currentDocument={currentDocument}
				editorState={editorState}
				docType={docType}
				loadingToggle={loadingToggle}
				onChangeEditorState={onChangeEditorState}
				cancelEdit={cancelEdit}
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, documentTitleInput, colorPickerInput, docType)}
				documentTitleInput={documentTitleInput}
				colorPickerInput={colorPickerInput}
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
		documentTitleInput: state.documentTitleInput,
		colorPickerInput: state.colorPickerInput,
		loadingToggle: state.loadingToggle,
		userErrors: state.userErrors,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		onDocumentTitleChange: documentTitleInput => {
			dispatch(actions.updateDocumentTitleInput(documentTitleInput))
		},
		onColorPickerInputChange: colorPickerInput => {
			dispatch(actions.updateColorPickerInput(colorPickerInput))
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
		onSubmitClick: (currentDocument, editorState, documentTitleInput, colorPickerInput, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, documentTitleInput, colorPickerInput, docType))
		}		
	}
}

EditorContent.propTypes = {
	currentDocument: PropTypes.object,
	editorState: PropTypes.object,
	documentTitleInput: PropTypes.string,
	docType: PropTypes.string,
	mode: PropTypes.string,
	loadingToggle: PropTypes.bool,
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