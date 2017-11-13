import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, highlightActive, currentChapter, chapterTitleInput, editorState } from './reducers/editor'
import { joyceAPIService, logger } from './actions'
import EditorContainer from './containers/editorContainer'

const reduceEditor = combineReducers({
	chapters,
	currentChapter,
	chapterTitleInput,
	highlightActive,
	editorState
})

let store = createStore(reduceEditor, applyMiddleware(joyceAPIService, logger))

ReactDOM.render(
	<Provider store={store}>
		<EditorContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch({type: 'GET_CHAPTER_DATA'})
store.dispatch({type: 'GET_TEXT_DATA', id: 1})