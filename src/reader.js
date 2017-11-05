import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import readerApp from './reducers'
import joyceAPIService from './middleware'
import { ReaderContainer } from './containers/readerContainer'

let store = createStore(readerApp, applyMiddleware(joyceAPIService))	

ReactDOM.render(
	<Provider store={store}>
		<ReaderContainer />
	</Provider>,
  	document.getElementById('joyce_reader')
)

store.dispatch({type: 'GET_CHAPTER_DATA'})