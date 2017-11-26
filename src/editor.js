import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, highlightActive, currentChapter, chapterTitleInput, editorState } from './reducers'
import { getDocumentList, setChapterToEdit } from './actions'
import { joyceAPI, logger } from './middleware'
import EditorContainer from './containers/editorContainer'

const reduceEditor = combineReducers({
	chapters,
	currentChapter,
	chapterTitleInput,
	highlightActive,
	editorState
})

let store = createStore(reduceEditor, applyMiddleware(joyceAPI, logger))

ReactDOM.render(
	<Provider store={store}>
		<EditorContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'chapters'}))
store.dispatch(setChapterToEdit(1))