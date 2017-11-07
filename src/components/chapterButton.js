import React from 'react'

const ChapterButton = ({chapter, onClick}) =>
	<div className ='chapter_button text-center'>
		<button onClick={onClick} className='btn btn-outline-dark btn-lg'>{chapter.name}</button>
	</div>

export default ChapterButton