import React from 'react'
import { ChapterButton } from './button'

const ChapterList = ({chapters, currentChapter, onChapterClick}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.number} currentChapterNumber={currentChapter.number} chapter={chapter} onClick={()=>onChapterClick(chapter.number)}/>
    	)}
	</div>

export default ChapterList