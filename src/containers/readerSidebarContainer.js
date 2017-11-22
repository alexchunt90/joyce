import React from 'react'
import { connect } from 'react-redux'
import { setChapterToRead, toggleHighlight } from '../actions'
import ChapterList from '../components/chapterList'
import { HighlightButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const ReaderSidebar = ({chapters, currentChapter, onChapterClick, highlightActive, onHighlightClick}) =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<HighlightButton highlightActive={highlightActive} onHighlightClick={onHighlightClick}/>
		<SidebarSpacer />
		<ChapterList chapters={chapters} currentChapter={currentChapter} onChapterClick={onChapterClick} />
	</div>

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		currentChapter: state.currentChapter,
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