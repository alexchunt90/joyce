import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceReader from './reducers/reduceReader'
import { getDocumentList, setCurrentDocument, setDocType } from './actions'
import { logger, joyceAPI } from './middleware/'
import { getFirstDocument } from './mixins/firstDocument'
import JoyceReaderPageContainer from './containers/joyceReaderPageContainer'

// TODO: Pass routing from Flask?

let docType = 'chapters'
let store = createStore(reduceReader, applyMiddleware(logger, joyceAPI))	
store.dispatch(setDocType(docType))

ReactDOM.render(
	<Provider store={store}>
		<JoyceReaderPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: docType}))

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => {
		const firstDocument = getFirstDocument(store, docType)
		if (firstDocument) {
			store.dispatch(setCurrentDocument(firstDocument.id, docType))
		}
	},
	1000
)