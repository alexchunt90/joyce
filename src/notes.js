import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceNotes from './reducers/reduceNotes'
import { getDocumentList, setCurrentNote } from './actions'
import { joyceAPI, logger } from './middleware/'
import JoyceNotesPageContainer from './containers/joyceNotesPageContainer'

let store = createStore(reduceNotes, applyMiddleware(joyceAPI, logger))	

ReactDOM.render(
	<Provider store={store}>
		<JoyceNotesPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'notes'}))

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => store.dispatch(setCurrentNote(store.getState().notes[0].id)),
	500
)