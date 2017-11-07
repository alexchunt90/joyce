import React from 'react'
import ChapterListContainer from '../containers/chapterListContainer'
import HighlighButtonContainer from '../containers/highlightButtonContainer'
import SidebarSpacer from './sidebarSpacer'

const Sidebar = () =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<HighlighButtonContainer />
		<SidebarSpacer />
		<ChapterListContainer />
	</div>

export default Sidebar