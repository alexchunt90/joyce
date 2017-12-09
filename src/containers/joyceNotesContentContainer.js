import React from 'react'
import { connect } from 'react-redux'
import { Editor, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import { EditModeTopBar }  from '../components/contentTopBar'
import { ReadModeBottomBar, EditModeBottomBar } from '../components/contentBottomBar'
import { updateEditorState, setEditMode, cancelEdit, submitNoteEdit, updateNoteTitleInput } from '../actions'

const JoyceNotesContent = ({currentNote, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setEditMode, cancelEdit, onSubmitClick, noteTitleInput, onNoteTitleChange}) =>
	<div>
		<div id='editor_metadata'>
			{mode === 'READ_MODE' &&
				<h4>{currentNote.title}</h4>
			}
			{mode === 'EDIT_MODE' &&
				<input type='text' value={noteTitleInput} onChange={onNoteTitleChange}/>
			}
		</div>
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
				<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={()=>onSubmitClick(currentNote, editorState, noteTitleInput)} />
			}
		</div>
	</div>

const mapStateToProps = state => {
	return {
		currentNote: state.currentNote,
		mode: state.mode,
		editorState: state.editorState,
		noteTitleInput: state.noteTitleInput
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(updateEditorState(editorState))
		},
		onNoteTitleChange: noteTitleInput => {
			dispatch(updateNoteTitleInput(noteTitleInput))
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
		onSubmitClick: (currentNote, editorState, noteTitleInput) => {
					let textContent = editorState.getCurrentContent()
					const data = { title: noteTitleInput, text: stateToHTML(textContent) }
					if (currentNote.id) {
						data.id = currentNote.id
					}
					dispatch(submitNoteEdit(data))
		}		
	}
}

const JoyceNotesContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceNotesContent)

export default JoyceNotesContentContainer