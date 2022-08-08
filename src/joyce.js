// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import 'bootstrap'

// src modules
import Navbar from './components/navbar'
import reduceJoyce from './reducers/reduceJoyce'
import actions from './actions'
import { logger, joyceAPI, joyceInterface, joyceRouter } from './middleware/'
import ReaderPageContainer from './containers/readerPageContainer'
import EditorPageContainer from './containers/editorPageContainer'
import SearchPageContainer from './containers/searchPageContainer'
import AdminHeaderContainer from './containers/adminHeaderContainer'

const history = createBrowserHistory()
const router = routerMiddleware(history)
const store = createStore(reduceJoyce, 
	applyMiddleware(logger, router, joyceAPI, joyceInterface, joyceRouter))	
const state = store.getState()

store.dispatch(actions.getDocumentList({docType: 'chapters'}))
store.dispatch(actions.getDocumentList({docType: 'notes'}))
store.dispatch(actions.getDocumentList({docType: 'tags'}))
store.dispatch(actions.getDocumentList({docType: 'media'}))

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div id='inner_wrapper'>
				<AdminHeaderContainer />
				<Navbar />
				<Switch>
					<Route exact path='/' render={() =>
						<Redirect to={'/:id'}/>
					}/>
					<Route exact path='/notes' render={() =>
						<Redirect to={'/notes/:id'}/>
					}/>
					<Route exact path='/edit' render={() =>
						<Redirect to={'/edit/:id'}/>
					}/>
					<Route exact path='/edit/notes' render={() =>
						<Redirect to={'/edit/notes/:id'}/>
					}/>
					<Route exact path='/edit/tags' render={() =>
						<Redirect to={'/edit/tags/:id'}/>
					}/>
					<Route exact path='/edit/media' render={() =>
						<Redirect to={'/edit/media/:id'}/>
					}/>															
					<Route exact path='/notes/:id' component={ReaderPageContainer} />
					<Route exact path='/edit/:id' component={EditorPageContainer} />
					<Route exact path='/edit/notes/:id' component={EditorPageContainer} />
					<Route exact path='/edit/tags/:id' component={EditorPageContainer} />
					<Route exact path='/edit/media/:id' component={EditorPageContainer} />
					<Route exact path='/search/' component={SearchPageContainer} />
					<Route exact path='/:id' component={ReaderPageContainer} />	
				</Switch>
			</div>
		</ConnectedRouter>
	</Provider>,
  	document.getElementById('wrapper')
)