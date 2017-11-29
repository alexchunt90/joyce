import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, highlightActive, currentChapter, chapterTitleInput, editorState } from './reducers'
import { getDocumentList, setCurrentChapter } from './actions'
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

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => store.dispatch(setCurrentChapter(store.getState().chapters[0].id)),
	1000
)