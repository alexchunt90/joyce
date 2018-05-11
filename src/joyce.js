// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import 'bootstrap'

// src modules
import Navbar from './components/navbar'
import reduceJoyce from './reducers/reduceJoyce'
import actions from './actions'
import { logger, joyceAPI, joyceInterface, joyceRouter } from './middleware/'
import ReaderPageContainer from './containers/readerPageContainer'
import EditorPageContainer from './containers/editorPageContainer'
import SearchPageContainer from './containers/searchPageContainer'

const history = createHistory()
const router = routerMiddleware(history)
const store = createStore(reduceJoyce, applyMiddleware(logger, router, joyceAPI, joyceInterface, joyceRouter))	
const state = store.getState()
// TODO: Modal container should probably be connected to Redux if possible

store.dispatch(actions.getDocumentList({docType: 'chapters'}))
store.dispatch(actions.getDocumentList({docType: 'notes'}))

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div>
				<Navbar />
				<Switch>
					<Route exact path='/' render={() =>
						<Redirect to={'/:id'}/>
					}/>
					<Route exact path='/edit' render={() =>
						<Redirect to={'/edit/:id'}/>
					}/>
					<Route exact path='/edit/notes' render={() =>
						<Redirect to={'/edit/notes/:id'}/>
					}/>					
					<Route exact path='/notes' render={() =>
						<Redirect to={'/notes/:id'}/>
					}/>							
					<Route exact path='/notes/:id' component={ReaderPageContainer} />
					<Route exact path='/edit/:id' component={EditorPageContainer} />
					<Route exact path='/edit/notes/:id' component={EditorPageContainer} />
					<Route exact path='/search/' component={SearchPageContainer} />
					<Route exact path='/:id' component={ReaderPageContainer} />	
				</Switch>
			</div>
		</ConnectedRouter>
	</Provider>,
  	document.getElementById('wrapper')
)