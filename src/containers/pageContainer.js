import React from 'react'
import { connect } from 'react-redux'
import { setCurrentChapter } from '../actions/actions'

class Page extends React.Component {
	render() {
		return (
			<div id="page">
				<h2>[{this.props.currentChapter.id}]</h2>
				<h3>{this.props.currentChapter.name}</h3>
				{this.props.currentChapter.text}
			</div>			
		)
	}
}

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