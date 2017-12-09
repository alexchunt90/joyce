import React from 'react'
import { connect } from 'react-redux'
import { Editor, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import { EditModeTopBar } from '../components/contentTopBar'
import { updateEditorState, updateChapterTitleInput, submitChapter, deleteChapter } from '../actions'

const JoyceTextEditor = ({currentChapter, editorState, handleKeyCommand, onChangeEditorState, onToolButtonClick}) =>
	<div className='joyce_text_editor'>		
		<div id='editor_topbar'>
			<EditModeTopBar editorState={editorState} onToolButtonClick={onToolButtonClick} />
		</div>	
		<div id='editor_content'>
			<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState} />
		</div>
	</div>


const mapStateToProps = state => { 
	return {
		currentChapter: state.currentChapter,
		editorState: state.editorState,
		chapterTitleInput: state.chapterTitleInput
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

const JoyceTextEditorContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceTextEditor)

export default JoyceTextEditorContainer