import React from 'react'
import { connect } from 'react-redux'

import { setCurrentChapter } from '../actions/actions'

import PageContainer from '../containers/pageContainer'
import Content from '../components/content'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

class Reader extends React.Component {
	render() {
		return (
			<div>
				<Navbar />
				<div id='joyce_reader' className='container-fluid'>
					<div className="row">
						<Sidebar />
						<Content>
							<PageContainer />
						</Content>
					</div>
				</div>
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