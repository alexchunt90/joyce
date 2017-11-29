import React from 'react'
import { connect } from 'react-redux'
import { Editor, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import JoyceTextEditorContainer from './joyceTextEditorContainer'
import { EditorSubmitButton, EditorDeleteButton } from '../components/button'
import { updateEditorState, updateChapterTitleInput, submitChapterEdit, deleteCurrentChapter } from '../actions'

const EditChapter = ({chapters, currentChapter, editorState, chapterTitleInput, onChapterTitleChange, onSubmitClick, onDeleteClick}) =>
	<div id='editor_container'>
		<div id='editor_metadata'>
			<div className='row'>			
				<div id='chapter_number_input' className='col-md-4'>
					Chapter {currentChapter.id ? currentChapter.number : chapters.length + 1}:
				</div>								
				<div id='chapter_title_input' className='col-md-8'>
					<input type='text' value={chapterTitleInput} onChange={onChapterTitleChange}/>
				</div>
			</div>
		</div>

		<JoyceTextEditorContainer />

		<div id='editor_bottombar'>
			<div className='row'>
				<div className='col-md-5'>
					<EditorDeleteButton onDeleteClick={()=>onDeleteClick(currentChapter)} currentChapter={currentChapter}/>
				</div>
				<div className='col-md-5 offset-md-2'>
					<EditorSubmitButton onSubmitClick={()=>onSubmitClick(chapters, currentChapter, chapterTitleInput, editorState)} currentChapter={currentChapter} chapterTitleInput={chapterTitleInput} editorState={editorState}/>
				</div>
			</div>
		</div>
	</div>

const mapStateToProps = state => { 
	return {
		chapters: state. chapters,
		currentChapter: state.currentChapter,
		editorState: state.editorState,
		chapterTitleInput: state.chapterTitleInput
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChapterTitleChange: chapterTitleInput => {
			dispatch(updateChapterTitleInput(chapterTitleInput))
		},
		onDeleteClick: currentChapter => {
			if (currentChapter.id) {
				dispatch(deleteCurrentChapter(currentChapter.id))
			}
		},
		onSubmitClick: (chapters, currentChapter, chapterTitleInput, editorState) => {
			let textContent = editorState.getCurrentContent()
			const data = {
				number: currentChapter.id ? currentChapter.number : chapters.length + 1,
				title: chapterTitleInput,
				text: stateToHTML(textContent)
			}
			if (currentChapter.id) {
				data.id = currentChapter.id
			}
			dispatch(submitChapterEdit(data))
		}
	}
}

const EditChapterContainer = connect(mapStateToProps, mapDispatchToProps)(EditChapter)

export default EditChapterContainer