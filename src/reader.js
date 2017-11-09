import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceReader from './reducers/reader'
import joyceAPIService from './middleware'
import { ReaderContainer } from './containers/readerContainer'

let store = createStore(reduceReader, applyMiddleware(joyceAPIService))	

ReactDOM.render(
	<Provider store={store}>
		<ReaderContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch({type: 'GET_CHAPTER_DATA'})
store.dispatch({type: 'GET_TEXT_DATA', id: 1})