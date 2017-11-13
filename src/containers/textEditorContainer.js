import React from 'react'
import { connect } from 'react-redux'
import { updateEditorState, updateChapterTitleInput } from '../actions'

import { Editor, convertToRaw } from 'draft-js';

import { glyphiconBold, glyphiconItalic, glyphiconUnderline, glyphiconAlignLeft, glyphiconAlignCenter, glyphiconAlignRight } from '../assets'

const TextEditor = ({editorState, onSaveEditorState, chapterTitleInput, onChapterTitleChange}) =>
	<div id='editor_container'>
		<div id='editor_topbar'>
			<div className='row'>			
				<div className='col-md-4'>
					<h4>Chapter 1:</h4>
				</div>				
				<div className='col-md-8'>
					<input type="text" value={chapterTitleInput} onChange={onChapterTitleChange}/>
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
			<Editor editorState={editorState} onChange={onSaveEditorState} />
		</div>

		<div id='editor_bottombar'>
			<div className='row'>
				<div className='col-md-5'>
					<button id='editor_delete' type='button' className='btn btn-danger btn-sm'>Delete</button>
				</div>
				<div className='col-md-5 offset-md-2'>
					<button id='editor_save' type='button' className='btn btn-success btn-sm'>Save</button>
				</div>
			</div>
		</div>
	</div>

const mapStateToProps = state => {
	return {
		editorState: state.editorState,
		chapterTitleInput: state.chapterTitleInput
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSaveEditorState: editorState => {
			dispatch(updateEditorState(editorState))
		},
		onChapterTitleChange: chapterTitleInput => {
			dispatch(updateChapterTitleInput(chapterTitleInput))
		}
	}
}

const TextEditorContainer = connect(mapStateToProps, mapDispatchToProps)(TextEditor)

export default TextEditorContainer