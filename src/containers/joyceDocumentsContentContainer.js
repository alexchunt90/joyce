import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { ReadModeTopBar, EditModeTopBar, AnnotateModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import { updateEditorState, handleEditorKeyCommand, applyInlineStyles, setMode, cancelEdit, submitDocumentEdit, updateDocumentTitleChange, addAnnotation } from '../actions'

const JoyceDocumentsContent = ({currentDocument, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setMode, cancelEdit, onSubmitClick, documentTitleInput, onDocumentTitleChange, onNewAnnotationClick, docType}) =>
	<div>
		<div id='editor_metadata'>
			{(mode === 'READ_MODE' || mode === 'ANNOTATE_MODE') &&
				<h4>{currentDocument.title}</h4>
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
				<AnnotateModeTopBar onNewAnnotationClick={()=>onNewAnnotationClick(editorState.getSelection())} disabled={editorState.getSelection().isCollapsed() ? true : false} />
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

const mapStateToProps = state => {
	return {
		currentDocument: state.currentDocument,
		mode: state.mode,
		docType: state.docType,
		editorState: state.editorState,
		documentTitleInput: state.documentTitleInput
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
		onToolButtonClick: (editorState, style) => {
			dispatch(applyInlineStyles(editorState, style))
		},
		onSubmitClick: (currentDocument, editorState, documentTitleInput, docType) => {
			dispatch(submitDocumentEdit(currentDocument, editorState, documentTitleInput, docType))
		}		
	}
}

const JoyceDocumentsContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceDocumentsContent)

export default JoyceDocumentsContentContainer