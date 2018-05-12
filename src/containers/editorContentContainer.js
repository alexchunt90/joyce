import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { ReadModeTopBar, EditModeTopBar, AnnotateModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const EditorContent = ({currentDocument, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setMode, cancelEdit, onSubmitClick, documentTitleInput, onDocumentTitleChange, onNewAnnotationClick, annotateKeyBindings, onRemoveAnnotationClick, docType, loadingToggle}) =>
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
			{mode === 'READ_MODE' &&
				<Editor editorState={editorState} readOnly={true} />
			}
			{mode === 'ANNOTATE_MODE' &&
				<Editor editorState={editorState} onChange={onChangeEditorState} keyBindingFn={annotateKeyBindings} />
			}
			{mode === 'EDIT_MODE' &&
				<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState}/>
			}			
		</div>
		<div id='editor_bottombar'>
			{(mode === 'EDIT_MODE' || mode === 'ANNOTATE_MODE') &&
				<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={()=>onSubmitClick(currentDocument, editorState, documentTitleInput, docType)} />
			}
		</div>
	</div>

const mapStateToProps = (state, props) => {
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
			dispatch(actions.updateEditorState(editorState))
		},
		onDocumentTitleChange: documentTitleInput => {
			dispatch(actions.updateDocumentTitleChange(documentTitleInput))
		},		
		handleKeyCommand: (command, editorState) => {
			dispatch(actions.handleEditorKeyCommand(editorState, command))
		},
		annotateKeyBindings: () => {
			return 'handled'
		},
		setMode: (mode) => {
			dispatch(actions.setMode(mode))
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
		onToolButtonClick: (editorState, style) => {
			dispatch(actions.applyInlineStyles(editorState, style))
		},
		onSubmitClick: (currentDocument, editorState, documentTitleInput, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, documentTitleInput, docType))
		}		
	}
}

const EditorContentContainer = connect(mapStateToProps, mapDispatchToProps)(EditorContent)

export default EditorContentContainer