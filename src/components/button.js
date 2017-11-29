import React from 'react'

export const ChapterNavButton = () =>
	<div className='nav_button text-center'>
		<button onClick='' className='btn btn-outline-primary btn-lg'>
			Chapters
		</button>
	</div>

export const ChapterButton = ({chapter, currentChapter, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={()=>onClick(chapter.id)} className={currentChapter.id === chapter.id ? 'btn btn-dark btn-lg' : 'btn btn-outline-dark btn-lg'}>
			{chapter.title}
		</button>
	</div>

export const HighlightButton = ({highlightActive, onHighlightClick}) =>
	<div>
		<div id="highlight_button" className="text-center">
			<button onClick={onHighlightClick} className={highlightActive ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'}>
				{highlightActive ? 'Hide Notes' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const NewChapterButton = ({onNewChapterClick}) =>
	<div>
		<div id="highlight_button" className="text-center">
			<button onClick={onNewChapterClick} className='btn btn-outline-success btn-lg'>
				New Chapter <i className="fa fa-plus-square-o"></i>
			</button>
		</div>
	</div>

export const EditorTopbarToolButton = ({glyph, onClick}) =>
	<button type='button' onClick={onClick} className='btn btn-info btn-sm'>
		<i className={'fa fa-' + glyph}></i>
	</button>

export const EditorSubmitButton = ({onSubmitClick}) =>
	<button id='editor_submit' onClick={onSubmitClick} type='button' className='btn btn-success btn-sm'>
		Submit
		<i className='fa fa-check-square-o'></i>
	</button>

export const EditorDeleteButton = ({onDeleteClick}) =>
	<button id='editor_delete' onClick={onDeleteClick} type='button' className='btn btn-danger btn-sm'>
		Delete
		<i className='fa fa-trash-o'></i>
	</button>