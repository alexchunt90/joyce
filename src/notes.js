import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceNotes from './reducers/reduceNotes'
import { getDocumentList } from './actions'
import { joyceAPI, logger } from './middleware/'
import JoyceNotesPage from './components/joyceNotesPage'

let store = createStore(reduceNotes, applyMiddleware(joyceAPI, logger))	

ReactDOM.render(
	<Provider store={store}>
		<JoyceNotesPage />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'notes'}))