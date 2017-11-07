import React from 'react'
import ChapterButton from './chapterButton'

const ChapterList = ({chapters, onChapterClick}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} chapter={chapter} onClick={()=>onChapterClick(chapter.id)}/>
    	)}
	</div>

export default ChapterList