import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap'

import reduceSearch from './reducers/reduceSearch'
import { logger, joyceAPI } from './middleware/'
import JoyceSearchPageContainer from './containers/joyceSearchPageContainer'

// TODO: Pass routing from Flask?

let store = createStore(reduceSearch, applyMiddleware(logger, joyceAPI))	

ReactDOM.render(
	<Provider store={store}>
		<JoyceSearchPageContainer />
	</Provider>,
  	document.getElementById('wrapper')
)