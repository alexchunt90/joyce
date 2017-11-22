import React from 'react'
import { connect } from 'react-redux'
import { setCurrentChapter } from '../actions'

const Page = ({currentChapter, highlightActive}) =>
	<div id="page" className={highlightActive ? 'show_notes' : 'hide_notes'}>
		<h2>[{currentChapter.number}]</h2>
		<h3>{currentChapter.title}</h3>
		<div dangerouslySetInnerHTML={{__html: currentChapter.text}} />
	</div>			

const mapStateToProps = state => {
	return {
		currentChapter: state.currentChapter,
		highlightActive: state.highlightActive
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