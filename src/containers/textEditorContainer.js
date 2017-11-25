import React from 'react'
import { connect } from 'react-redux'
import { Editor, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import { updateEditorState, updateChapterTitleInput, updateChapterNumberInput, submitChapter, deleteChapter } from '../actions'


const TextEditor = ({currentChapter, editorState, handleKeyCommand, onChangeEditorState, onBoldClick, onItalicClick, onUnderlineClick, onHeaderClick, chapterTitleInput, onChapterTitleChange, onEditSubmit, onDelete}) =>
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
				<div className='btn-group col-md-3' role='group'>
					<button type='button' onClick={()=>onBoldClick(editorState)} className='btn btn-info btn-sm'><i className='fa fa-bold'></i></button>
					<button type='button' onClick={()=>onItalicClick(editorState)} className='btn btn-info btn-sm'><i className='fa fa-italic'></i></button>
					<button type='button' onClick={()=>onUnderlineClick(editorState)} className='btn btn-info btn-sm'><i className='fa fa-underline'></i></button>
					<button type='button' onClick={()=>onHeaderClick(editorState)} className='btn btn-info btn-sm'><i className='fa fa-header'></i></button>
				</div>
				<div className='btn-group col-md-3' role='group'>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-align-left'></i></button>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-align-center'></i></button>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-align-right'></i></button>			
				</div>
				<div className='btn-group col-md-1' role='group'>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-file-image-o'></i></button>
				</div>
				<div className='btn-group col-md-2' role='group'>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-indent'></i></button>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-outdent'></i></button>
				</div>								
				<div className='btn-group col-md-2' role='group'>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-undo'></i></button>
					<button type='button' className='btn btn-info btn-sm'><i className='fa fa-repeat'></i></button>
				</div>
			</div>
		</div>

		<div id='editor_content'>
			<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={onChangeEditorState} />
		</div>

		<div id='editor_bottombar'>
			<div className='row'>
				<div className='col-md-5'>
					<button id='editor_delete' onClick={()=>onDelete(currentChapter)} type='button' className='btn btn-danger btn-sm'>
						Delete
						<i className='fa fa-trash-o'></i>
					</button>
				</div>
				<div className='col-md-5 offset-md-2'>
					<button id='editor_save' onClick={()=>onEditSubmit(currentChapter, chapterTitleInput, editorState)} type='button' className='btn btn-success btn-sm'>
						Save
						<i className='fa fa-check-square-o'></i>
					</button>
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
		handleKeyCommand: (command, editorState) => {
			const newState = RichUtils.handleKeyCommand(editorState, command)
			dispatch(updateEditorState(newState))
		},
		onBoldClick: (editorState) => {
			const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD')
			dispatch(updateEditorState(newState))
		},
		onItalicClick: (editorState) => {
			const newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC')
			dispatch(updateEditorState(newState))
		},
		onUnderlineClick: (editorState) => {
			const newState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
			dispatch(updateEditorState(newState))
		},
		onHeaderClick: (editorState) => {
			const newState = RichUtils.toggleBlockType(editorState, 'header-two')
			dispatch(updateEditorState(newState))
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