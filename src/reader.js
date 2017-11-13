import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, currentChapter, highlightActive } from './reducers/reader'
import { joyceAPIService } from './actions'
import { ReaderContainer } from './containers/readerContainer'

const reduceReader = combineReducers({
	chapters,
	currentChapter,
	highlightActive
})

let store = createStore(reduceReader, applyMiddleware(joyceAPIService))	

ReactDOM.render(
	<Provider store={store}>
		<ReaderContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch({type: 'GET_CHAPTER_DATA'})
store.dispatch({type: 'GET_TEXT_DATA', id: 1})