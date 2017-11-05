import React from 'react'

//  	render() {
//         return (
//         	<div>
// 				<div id="highlight_button" className="text-center">
// 					<a href="#" className="btn btn-primary btn-lg">Highlight Notes</a>
// 				</div>
// 	        	<ChapterList chapters={this.state.chapters} />
//         	</div>
//       	);
//   	}
// }

const ChapterList = ({chapters, onChapterClick}) =>
	<div>
		{console.log(chapters)}
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} chapter={chapter} onClick={()=>onChapterClick(chapter.id)}/>
    	)}
	</div>

const ChapterButton = ({chapter, onClick}) =>
	<div className ='text-center'>
		<a href={chapter.id} onClick={onClick} className='chapter_button btn btn-default btn-lg'>{chapter.name}</a>
	</div>

export default ChapterList