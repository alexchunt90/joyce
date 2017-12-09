import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceReader from './reducers/reduceReader'
import { getDocumentList, setCurrentChapter } from './actions'
import { logger, joyceAPI } from './middleware/'
import JoyceReaderPage from './components/joyceReaderPage'

let store = createStore(reduceReader, applyMiddleware(logger, joyceAPI))	

ReactDOM.render(
	<Provider store={store}>
		<JoyceReaderPage />
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