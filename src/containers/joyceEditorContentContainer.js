import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { ReadModeTopBar, EditModeTopBar, AnnotateModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'
import { updateEditorState, handleEditorKeyCommand, applyInlineStyles, setMode, cancelEdit, submitDocumentEdit, updateDocumentTitleChange, addAnnotation, removeAnnotation } from '../actions'

const JoyceEditorContent = ({currentDocument, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setMode, cancelEdit, onSubmitClick, documentTitleInput, onDocumentTitleChange, onNewAnnotationClick, onRemoveAnnotationClick, docType, loadingToggle}) =>
	<div>
		<div id='editor_metadata'>
			{loadingToggle === true &&
				<LoadingSpinner />
			}
			{(mode === 'READ_MODE' || mode === 'ANNOTATE_MODE') &&
				<DocumentTitle docType={docType} currentDocument={currentDocument} />
			}
			{mode === 'EDIT_MODE' &&
				<input type='text' value={documentTitleInput} onChange={onDocumentTitleChange}/>
			}
		</div>
		<div id='editor_topbar'>
			{mode === 'READ_MODE' &&
				<ReadModeTopBar setMode={setMode} />
			}
			{mode === 'ANNOTATE_MODE' &&
				<AnnotateModeTopBar onNewAnnotationClick={()=>onNewAnnotationClick(editorState.getSelection())} onRemoveAnnotationClick={()=>onRemoveAnnotationClick(editorState)} addDisabled={editorState.getSelection().isCollapsed() ? true : false} removeDisabled={(editorState.getSelection().isCollapsed() ) ? true : false}/>
			}
			{mode === 'EDIT_MODE' &&
				<EditModeTopBar editorState={editorState} onToolButtonClick={onToolButtonClick} disabled={!currentDocument.id ? true : false}/>
			}
		</div>	
		<div id='editor_content'>
			<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState} readOnly={mode === 'READ_MODE' ? true : false } />
		</div>
		<div id='editor_bottombar'>
			{(mode === 'EDIT_MODE' || mode === 'ANNOTATE_MODE') &&
				<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={()=>onSubmitClick(currentDocument, editorState, documentTitleInput, docType)} />
			}
		</div>
	</div>

const mapStateToProps = (state, props ) => {
	return {
		currentDocument: state.currentDocument,
		mode: state.mode,
		docType: state.docType,
		editorState: state.editorState,
		documentTitleInput: state.documentTitleInput,
		loadingToggle: state.loadingToggle
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(updateEditorState(editorState))
		},
		onDocumentTitleChange: documentTitleInput => {
			dispatch(updateDocumentTitleChange(documentTitleInput))
		},		
		handleKeyCommand: (editorState, command) => {
			dispatch(handleEditorKeyCommand(editorState, command))
		},
		setMode: (mode) => {
			dispatch(setMode(mode))
		},
		cancelEdit: () => {
			dispatch(cancelEdit())
		},
		onNewAnnotationClick: (selectionState) => {
			dispatch(addAnnotation(selectionState))
		},
		onRemoveAnnotationClick: (editorState) => {
			dispatch(removeAnnotation(editorState))
		},
		onToolButtonClick: (editorState, style) => {
			dispatch(applyInlineStyles(editorState, style))
		},
		onSubmitClick: (currentDocument, editorState, documentTitleInput, docType) => {
			dispatch(submitDocumentEdit(currentDocument, editorState, documentTitleInput, docType))
		}		
	}
}

const JoyceEditorContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceEditorContent)

export default JoyceEditorContentContainer