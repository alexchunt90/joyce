import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceChapters from './reducers/reduceChapters'
import { getDocumentList, setCurrentChapter } from './actions'
import { joyceAPI, logger } from './middleware'
import JoyceChaptersPage from './components/joyceChaptersPage'

let store = createStore(reduceChapters, applyMiddleware(joyceAPI, logger))

ReactDOM.render(
	<Provider store={store}>
		<JoyceChaptersPage />
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