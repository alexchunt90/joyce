import React from 'react'

export const ChapterNavButton = () =>
	<div className='nav_button text-center'>
		<button onClick='' className='btn btn-outline-primary btn-lg'>
			Chapters
		</button>
	</div>

export const ChapterButton = ({chapter, currentChapterNumber, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={onClick} className={currentChapterNumber === chapter.number ? 'btn btn-dark btn-lg' : 'btn btn-outline-dark btn-lg'}>
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