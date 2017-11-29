import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { chapters, currentChapter, highlightActive } from './reducers'
import { getDocumentList, setCurrentChapter } from './actions'
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

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => store.dispatch(setCurrentChapter(store.getState().chapters[0].id)),
	1000
)