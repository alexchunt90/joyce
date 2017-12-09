import { combineReducers } from 'redux'

import chapters from './chapters'
import currentChapter from './currentChapter'
import chapterTitleInput from './chapterTitleInput'
import highlightActive from './highlightActive'
import editorState from './editorState'

const reduceChapters = combineReducers({
	chapters,
	currentChapter,
	chapterTitleInput,
	highlightActive,
	editorState
})

export default reduceChapters