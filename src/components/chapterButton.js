import React from 'react'

const ChapterButton = ({chapter, onClick}) =>
	<div className ='text-center'>
		<a onClick={onClick} className='chapter_button btn btn-default btn-lg'>{chapter.name}</a>
	</div>

export default ChapterButton