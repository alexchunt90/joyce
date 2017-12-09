import React from 'react'
import { connect } from 'react-redux'
import { Editor, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import { EditModeTopBar }  from '../components/contentTopBar'
import { ReadModeBottomBar, EditModeBottomBar } from '../components/contentBottomBar'
import { updateEditorState, setEditMode, cancelEdit, submitNoteEdit } from '../actions'

const JoyceNotesContent = ({currentNote, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setEditMode, cancelEdit, onSubmitClick}) =>
	<div>
		<div id='editor_topbar'>
			{mode === 'EDIT_MODE' &&
				<EditModeTopBar editorState={editorState} onToolButtonClick={onToolButtonClick} />
			}
		</div>	
		<div id='editor_content'>
			<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState} readOnly={mode === 'READ_MODE' ? true : false }/>
		</div>
		<div id='editor_bottombar'>
			{mode === 'READ_MODE' &&
				<ReadModeBottomBar setEditMode={setEditMode} />
			}
			{mode === 'EDIT_MODE' &&
				<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={()=>onSubmitClick(currentNote, editorState)} />
			}
		</div>
	</div>

const mapStateToProps = state => {
	return {
		currentNote: state.currentNote,
		editorState: state.editorState,
		mode: state.mode
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(updateEditorState(editorState))
		},
		handleKeyCommand: (command, editorState) => {
			const newState = RichUtils.handleKeyCommand(editorState, command)
			dispatch(updateEditorState(newState))
		},
		setEditMode: () => {
			dispatch(setEditMode())
		},
		cancelEdit: () => {
			dispatch(cancelEdit())
		},
		onToolButtonClick: (editorState, style) => {
			let inlineStyles = ['BOLD', 'ITALIC', 'UNDERLINE']
			if (inlineStyles.indexOf(style) >= 0) {
				const newInlineStyleState = RichUtils.toggleInlineStyle(editorState, style)
				dispatch(updateEditorState(newInlineStyleState))
			} else if (style === 'header-two') {
				const newBlockTypeState = RichUtils.toggleBlockType(editorState, 'header-two')
				dispatch(updateEditorState(newBlockTypeState))					
			}
		},
		onSubmitClick: (currentNote, editorState) => {
					let textContent = editorState.getCurrentContent()
					const data = { title: currentNote.title, text: stateToHTML(textContent) }
					if (currentNote.id) {
						data.id = currentNote.id
					}
					dispatch(submitNoteEdit(data))
		}		
	}
}

const JoyceNotesContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceNotesContent)

export default JoyceNotesContentContainer