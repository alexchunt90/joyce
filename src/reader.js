import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, currentChapter, highlightActive } from './reducers'
import { getChapterList, setChapterToRead } from './actions'
import { joyceAPI } from './middleware/'
import ReaderContainer from './containers/readerContainer'

const reduceReader = combineReducers({
	chapters,
	currentChapter,
	highlightActive
})

let store = createStore(reduceReader, applyMiddleware(joyceAPI))	

ReactDOM.render(
	<Provider store={store}>
		<ReaderContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getChapterList())
store.dispatch(setChapterToRead(1))