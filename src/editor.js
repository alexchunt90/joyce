import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceEditor from './reducers/reduceEditor'
import { getDocumentList, setCurrentDocument, setDocType } from './actions'
import { joyceAPI, logger } from './middleware/'
import { getFirstDocument } from './mixins/firstDocument'
import JoyceEditorPageContainer from './containers/joyceEditorPageContainer'

const docType = 'chapters'
const store = createStore(reduceEditor, applyMiddleware(joyceAPI, logger))	
store.dispatch(setDocType(docType))

ReactDOM.render(
	<Provider store={store}>
		<JoyceEditorPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({docType: 'notes'}))
store.dispatch(getDocumentList({docType: docType}))

// Hacky way to fetch first chapter after async call above has completed.
// TODO: Add number lookup to API?
setTimeout(
	() => store.dispatch(setCurrentDocument(getFirstDocument(store, docType).id, docType)),
	500
)