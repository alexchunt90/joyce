import React from 'react'
import { connect } from 'react-redux'
import { setChapterToEdit, createNewChapter } from '../actions'
import ChapterList from '../components/chapterList'
import { NewChapterButton } from '../components/button'
import SidebarSpacer from '../components/sidebarSpacer'

const EditorSidebar = ({chapters, currentChapter, onChapterClick, onNewChapterClick}) =>
	<div className="col-md-3" id="sidebar">
		<SidebarSpacer />
		<NewChapterButton onNewChapterClick={onNewChapterClick}/>
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
		onNewChapterClick: () => {
			dispatch(createNewChapter())
		},
		onChapterClick: id => {
			dispatch(setChapterToEdit(id))
		}
	}
}

const EditorSidebarContainer = connect(mapStateToProps, mapDispatchToProps)(EditorSidebar)

export default EditorSidebarContainer