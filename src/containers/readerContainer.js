import React from 'react'
import { connect } from 'react-redux'

import { setCurrentChapter } from '../actions/actions'

import Sidebar from '../components/sidebar'
import PageContainer from '../containers/pageContainer'

class Reader extends React.Component {
	render() {
		return (
			<div className="row">
				<Sidebar />
				<PageContainer />
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

export const ReaderContainer = connect(mapStateToProps, mapDispatchToProps)(Reader)