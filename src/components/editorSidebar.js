import React from 'react'
import ChapterListContainer from '../containers/chapterListContainer'
import NewChapterButtonContainer from '../containers/newChapterButtonContainer'
import SidebarSpacer from './sidebarSpacer'

const EditorSidebar = () =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<NewChapterButtonContainer />
		<SidebarSpacer />
		<ChapterListContainer />
	</div>

export default EditorSidebar