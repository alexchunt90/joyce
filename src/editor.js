import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceEditor from './reducers/editor'
import joyceAPIService from './middleware'
import EditorContainer from './containers/editorContainer'

let store = createStore(reduceEditor, applyMiddleware(joyceAPIService))	

ReactDOM.render(
	<Provider store={store}>
		<EditorContainer />
	</Provider>,
  	document.getElementById('wrapper')
)
store.dispatch({type: 'GET_CHAPTER_DATA'})
store.dispatch({type: 'GET_TEXT_DATA', id: 1})