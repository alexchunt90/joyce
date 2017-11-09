import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, highlightActive, currentChapter, editorState } from './reducers/editor'
import joyceAPIService from './middleware'
import EditorContainer from './containers/editorContainer'

const reduceEditor = combineReducers({
	chapters,
	currentChapter,
	highlightActive,
	editorState
})

let store = createStore(reduceEditor, applyMiddleware(joyceAPIService))

ReactDOM.render(
	<Provider store={store}>
		<EditorContainer />
	</Provider>,
  	document.getElementById('wrapper')
)