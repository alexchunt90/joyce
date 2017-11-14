import React from 'react'

export const ChapterNavButton = () =>
	<div className='nav_button text-center'>
		<button onClick='' className='btn btn-outline-primary btn-lg'>
			Chapters
		</button>
	</div>

export const ChapterButton = ({chapter, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={onClick} className='btn btn-outline-dark btn-lg'>
			{chapter.name}
		</button>
	</div>

export const HighlightButton = ({highlightActive, onHighlightClick}) =>
	<div>
		<div id="highlight_button" className="text-center">
			<button onClick={onHighlightClick} className={highlightActive ? 'btn btn-primary btn-lg' : 'btn btn-outline-primary btn-lg'}>
				{highlightActive ? 'Remove Highlight' : 'Highlight Notes'}
			</button>
		</div>
	</div>

export const NewChapterButton = ({onNewChapterClick}) =>
	<div>
		<div id="highlight_button" className="text-center">
			<button onClick={onNewChapterClick} className='btn btn-outline-success btn-lg'>
				New Chapter <strong>+</strong>
			</button>
		</div>
	</div>	