import React from 'react'
import { connect } from 'react-redux'

import { EditNoteButton } from '../components/button'
import EditorTopbar from '../components/editorTopbar'
import { ReaderBottombar, EditorBottombar } from '../components/notePageBottombar'
import { updateEditorState, setEditMode, 	 } from '../actions'
import { Editor, RichUtils } from 'draft-js'

const NotePage = ({currentNote, editorState, mode, handleKeyCommand, onChangeEditorState, onToolButtonClick, setEditMode, cancelEdit}) =>
	<div>
		<div id='editor_topbar'>
			{mode === 'EDIT_MODE' &&
				<EditorTopbar editorState={editorState} onToolButtonClick={onToolButtonClick} />
			}
		</div>	
		<div id='editor_content'>
			<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState} readOnly={mode === 'READ_MODE' ? true : false }/>
		</div>
		<div id='editor_bottombar'>
			{mode === 'READ_MODE' &&
				<ReaderBottombar setEditMode={setEditMode} />
			}
			{mode === 'EDIT_MODE' &&
				<EditorBottombar cancelEdit={cancelEdit} />
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
	}
}

const NotePageContainer = connect(mapStateToProps, mapDispatchToProps)(NotePage)

export default NotePageContainer