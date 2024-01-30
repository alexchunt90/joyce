// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import 'bootstrap'

// import { gapi } from 'gapi-script'
import { GoogleOAuthProvider } from '@react-oauth/google'

// src modules
import reduceJoyce from './reducers/reduceJoyce'
import actions from './actions'
import { logger, joyceAPI, joyceInterface, joyceRouter, googleAuth } from './middleware/'
import NavbarContainer from './containers/navbarContainer'
import ReaderPageContainer from './containers/readerPageContainer'
import EditorPageContainer from './containers/editorPageContainer'
import SearchPageContainer from './containers/searchPageContainer'
import AdminPageContainer from './containers/adminPageContainer'
import AdminHeaderContainer from './containers/adminHeaderContainer'

const history = createBrowserHistory()
const router = routerMiddleware(history)
const store = createStore(reduceJoyce(history), 
	applyMiddleware(router, logger, joyceAPI, joyceInterface, joyceRouter, googleAuth))

store.dispatch(actions.getDocumentList({docType: 'chapters'}))
store.dispatch(actions.getDocumentList({docType: 'notes'}))
store.dispatch(actions.getDocumentList({docType: 'tags'}))
store.dispatch(actions.getDocumentList({docType: 'media'}))
store.dispatch(actions.getDocumentList({docType: 'editions'}))

const cookies = document.cookie
if (cookies.includes('csrf_access_token')) {
	const user_name = cookies.match(/user_name=([a-zA-Z]*)/g).toString().split(/\=/g)[1]
	store.dispatch(actions.resumeUserSession(user_name))
}


ReactDOM.render(
	<GoogleOAuthProvider clientId='872741088218-5ooer62cvh4v2i9592buqplcorq8e571.apps.googleusercontent.com'>
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<div id='inner_wrapper'>
					<AdminHeaderContainer />
					<NavbarContainer/>
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
						<Route exact path='/edit/editions' render={() =>
							<Redirect to={'/edit/editions/:id'}/>
						}/>					
						<Route exact path='/edit/media' render={() =>
							<Redirect to={'/edit/media/:id'}/>
						}/>																
						<Route exact path='/notes/:id' component={ReaderPageContainer} />
						<Route exact path='/edit/:id' component={EditorPageContainer} />
						<Route exact path='/edit/notes/:id' component={EditorPageContainer} />
						<Route exact path='/edit/tags/:id' component={EditorPageContainer} />
						<Route exact path='/edit/editions/:id' component={EditorPageContainer} />
						<Route exact path='/edit/media/:id' component={EditorPageContainer} />
						<Route exact path='/search/' component={SearchPageContainer} />
						<Route exact path='/admin/' component={AdminPageContainer} />
						<Route exact path='/:id' component={ReaderPageContainer} />	
					</Switch>
				</div>
			</ConnectedRouter>
		</Provider>
	</GoogleOAuthProvider>,
  	document.getElementById('wrapper')
)