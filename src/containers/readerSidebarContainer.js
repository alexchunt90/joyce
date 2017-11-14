import React from 'react'
import { connect } from 'react-redux'
import { setChapterToRead, toggleHighlight } from '../actions'
import ChapterList from '../components/chapterList'
import { HighlightButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const ReaderSidebar = ({chapters, onChapterClick, highlightActive, onHighlightClick}) =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<HighlightButton highlightActive={highlightActive} onHighlightClick={onHighlightClick}/>
		<SidebarSpacer />
		<ChapterList chapters={chapters} onChapterClick={onChapterClick} />
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		highlightActive: state.highlightActive
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChapterClick: id => {
			dispatch(setChapterToRead(id))
		},
		onHighlightClick: () => {
			dispatch(toggleHighlight())
		}		
	}
}

const ReaderSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(ReaderSidebar)

export default ReaderSidebarContainer