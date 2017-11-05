import React from 'react';
import ReactDOM from 'react-dom';

const Editor = props =>
	<div className='col-sm-4'>

	</div>

	
const EditSidebar = props =>
	<EditChapterList chapters={props.chapters}/>

const EditChapterList = props =>
	{this.props.chapters.map(chapter =>
		<div>
			<EditChapterButton chapter={chapter} />
		</div>
	)}
	
const EditChapterButton = props =>
	<a className=''>{props.chapter.name}</a>

const EditChapter = props => 
	<div className='text_wrapper'>
		{props.currentChapter.text}
	</div>
