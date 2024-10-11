import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock } from '../components/editorContentBlock'
import { EditorSubmitOptions } from '../components/editorOptionBlock'
import EditorPaginateOptions from '../components/editorPaginateOptionsBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import TagColorPicker from '../components/tagColorPicker'
import LoadingSpinner from '../components/loadingSpinner'

const EditorPaginateMode = ({
	editions,
	currentDocument,
	editorState,
	paginationState,
	docType,
	inputs,
	setPaginationEdition,
	onChangeEditorState,
	paginateKeyBindings,
	cancelEdit,
	onSubmitClick,
	updatePageNumberInput,
	createPageBreak,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper d-flex flex-column'>
		<EditorTitleContentBlock>
			<DocumentTitle 
				docType={docType} 
				currentDocument={currentDocument} 
			/>
		</EditorTitleContentBlock>

		<EditorTopBarContentBlock>
			<EditorPaginateOptions 
				editions={editions}
				currentEdition={paginationState.paginationEdition}
				selectionState={editorState.getSelection()}
				setPaginationEdition={setPaginationEdition}
				pageNumberInput={inputs.pageNumber}
				onPageNumberInputChange={updatePageNumberInput}
				createPageBreak={createPageBreak}
			/>
		</EditorTopBarContentBlock>

		<EditorTextContentBlock>
			<TextEditor 
				editorState={editorState} 
				docType={docType}
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
		editions: state.editions,
		currentDocument: state.currentDocument,
		docType: state.docType,
		editorState: state.editorState,
		paginationState: state.paginationState,
		inputs: state.inputs,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		updatePageNumberInput: input => {
			dispatch(actions.updatePageNumberInput(input))
		},
		paginateKeyBindings: () => {
			// Prevents editor input in Annotation Mode
			// To-do: Rework to allow cursor with arrow keys
			return 'handled'
		},
		setPaginationEdition: (edition) => {
			dispatch(actions.setPaginationEdition(edition))
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		},
		createPageBreak: (pageNumber, year, selectionState) => {
			dispatch(actions.createPageBreak(pageNumber, year, selectionState))
		}
	}
}

const EditorPaginateModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorPaginateMode)	

export default EditorPaginateModeContainer