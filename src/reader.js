// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
// import 'bootstrap'

// src packages
import reduceReader from './reducers/reduceReader'
import { getDocumentList } from './actions/apiActions'
import { setCurrentDocument, setDocType } from './actions/userActions'
import { logger, joyceAPI } from './middleware/'
import { getFirstDocument } from './mixins/firstDocument'
import JoyceReaderPageContainer from './containers/joyceReaderPageContainer'
import JoyceEditorPageContainer from './containers/joyceEditorPageContainer'

// TODO: Pass routing from Flask?

const history = createHistory()
const router = routerMiddleware(history)

const docType = 'chapters'
const store = createStore(reduceReader, applyMiddleware(logger, joyceAPI, router))	
store.dispatch(setDocType(docType))

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div>
				<JoyceReaderPageContainer />
			</div>
		</ConnectedRouter>
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({
	docType: docType,
	state: 'initialPageLoad'
}))