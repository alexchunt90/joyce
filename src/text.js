import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceDocuments from './reducers/reduceDocuments'
import { getDocumentList, setCurrentDocument, setDocType } from './actions'
import { joyceAPI, logger } from './middleware/'
import JoyceDocumentsPageContainer from './containers/joyceDocumentsPageContainer'

let docType = 'chapters'
let store = createStore(reduceDocuments, applyMiddleware(joyceAPI, logger))	
store.dispatch(setDocType(docType))

const getFirstDocument = (docType) => {
	switch(docType) {
		case 'chapters':
			return store.getState().chapters[0]
		case 'notes':
			return store.getState().notes[0]
	}
}

ReactDOM.render(
	<Provider store={store}>
		<JoyceDocumentsPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'notes'}))
store.dispatch(getDocumentList({docType: docType}))

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => store.dispatch(setCurrentDocument(getFirstDocument(docType).id, docType)),
	500
)