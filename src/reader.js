import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, currentChapter, highlightActive } from './reducers'
import { getDocumentList, setChapterToRead } from './actions'
import { logger, joyceAPI } from './middleware/'
import ReaderContainer from './containers/readerContainer'

const reduceReader = combineReducers({
	chapters,
	currentChapter,
	highlightActive
})

let store = createStore(reduceReader, applyMiddleware(logger, joyceAPI))	

ReactDOM.render(
	<Provider store={store}>
		<ReaderContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'chapters'}))
store.dispatch(setChapterToRead(1))