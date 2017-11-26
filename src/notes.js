import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import { notes, currentNote } from './reducers'
import { getNoteList, setNoteToRead } from './actions'
import { joyceAPI } from './middleware/'
import JoyceNotesPageContainer from './containers/joyceNotesPageContainer'

const reduceNotes = combineReducers({
	notes,
	currentNote
})

let store = createStore(reduceNotes, applyMiddleware(joyceAPI))	

ReactDOM.render(
	<Provider store={store}>
		<JoyceNotesPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getNoteList())
store.dispatch(setNoteToRead(1))