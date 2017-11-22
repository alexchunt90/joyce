import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'


import { updateEditorState, updateChapterTitleInput, updateChapterNumberInput, submitChapter, deleteChapter } from '../actions'


import { glyphiconBold, glyphiconItalic, glyphiconUnderline, glyphiconAlignLeft, glyphiconAlignCenter, glyphiconAlignRight } from '../assets'

const TextEditor = ({currentChapter, editorState, onChangeEditorState, chapterTitleInput, onChapterTitleChange, onEditSubmit, onDelete}) =>
	<div id='editor_container'>
		<div id='editor_topbar'>
			<div className='row'>			
				<div id='chapter_number_input' className='col-md-4'>
					Chapter {currentChapter.number}:
				</div>								
				<div id='chapter_title_input' className='col-md-8'>
					<input type='text' value={chapterTitleInput} onChange={onChapterTitleChange}/>
				</div>

			</div>
			<div className='row'>
				<div className='btn-group col-md-3 offset-md-6' role='group'>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconBold} /></button>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconItalic} /></button>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconUnderline} /></button>
				</div>
				<div className='btn-group col-md-3' role='group'>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconAlignLeft} /></button>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconAlignCenter} /></button>
					<button type='button' className='btn btn-info btn-sm'><img src={glyphiconAlignRight} /></button>			
				</div>
			</div>
		</div>

		<div id='editor_content'>
			<Editor editorState={editorState} onChange={onChangeEditorState} />
		</div>

		<div id='editor_bottombar'>
			<div className='row'>
				<div className='col-md-5'>
					<button id='editor_delete' onClick={()=>onDelete(currentChapter)} type='button' className='btn btn-danger btn-sm'>Delete</button>
				</div>
				<div className='col-md-5 offset-md-2'>
					<button id='editor_save' onClick={()=>onEditSubmit(currentChapter, chapterTitleInput, editorState)} type='button' className='btn btn-success btn-sm'>Save</button>
				</div>
			</div>
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
		onChapterTitleChange: chapterTitleInput => {
			dispatch(updateChapterTitleInput(chapterTitleInput))
		},
		onDelete: currentChapter => {
			if (currentChapter.title !== '') {
				dispatch(deleteChapter(currentChapter.number))
			}
		},
		onEditSubmit: (currentChapter, chapterTitleInput, editorState) => {
			let textContent = editorState.getCurrentContent()
			const editDocument = {
				number: currentChapter.number,
				title: chapterTitleInput,
				text: stateToHTML(textContent)
			}
			dispatch(submitChapter(editDocument))
		}
	}
}

const TextEditorContainer = connect(mapStateToProps, mapDispatchToProps)(TextEditor)

export default TextEditorContainer