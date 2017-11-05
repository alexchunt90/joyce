import { connect } from 'react-redux'
import ChapterList from '../components'
import { setCurrentChapter } from '../actions/actions'

const mapStateToProps = state => {
	console.log('State is:')
	console.log(state)
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

export const ChapterListContainer = connect(mapStateToProps, mapDispatchToProps)(ChapterList)