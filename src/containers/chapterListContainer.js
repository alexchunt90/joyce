import React from 'react'
import { connect } from 'react-redux'

import { setCurrentChapter } from '../actions'

import ChapterList from '../components/chapterList'

const mapStateToProps = state => {
	return {
		chapters: state.chapters,
		currentChapter: state.currentChapter
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChapterClick: id => {
			dispatch(setCurrentChapter(id))
		}
	}
}

const ChapterListContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterList)

export default ChapterListContainer