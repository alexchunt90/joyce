import React from 'react'
import { ChapterButton } from './button'

const ChapterList = ({chapters, currentChapter, onChapterClick}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} currentChapter={currentChapter} chapter={chapter} onClick={onChapterClick}/>
    	)}
	</div>

export default ChapterList