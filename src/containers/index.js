import { connect } from 'react-redux'
import ChapterList from '../components'

const mapStateToProps = state => {
	// console.log('State is:')
	// console.log(state)
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