import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import readerApp from './reducers'
import ChapterListContainer from './containers'
import joyceAPIService from './middleware'

let store = createStore(readerApp, applyMiddleware(joyceAPIService))	

ReactDOM.render(
	<Provider store={store}>
		<ChapterListContainer />
	</Provider>,
  	document.getElementById('sidebar')
)

store.dispatch({type: 'GET_CHAPTER_DATA'})