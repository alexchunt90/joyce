import React from 'react'
import { connect } from 'react-redux'
import ChapterList from '../components'
import { setCurrentChapter } from '../actions/actions'

class Page extends React.Component {
	render() {
		{console.log(this.props.currentChapter)}
		return (
			<div className="col-xs-8" id="reader">
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