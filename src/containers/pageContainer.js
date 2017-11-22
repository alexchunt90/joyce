import React from 'react'
import { connect } from 'react-redux'
import { setCurrentChapter } from '../actions'

const Page = ({currentChapter}) =>
	<div id="page">
		<h2>[{currentChapter.number}]</h2>
		<h3>{currentChapter.title}</h3>
		<div dangerouslySetInnerHTML={{__html: currentChapter.text}} />
	</div>			

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

const PageContainer = connect(mapStateToProps, mapDispatchToProps)(Page)

export default PageContainer