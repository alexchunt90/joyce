// node_modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Route, Routes, matchPath } from 'react-router-dom'
import { ReduxRouter, createRouterMiddleware, createRouterReducerMapObject } from '@lagunovsky/redux-react-router'
import { createBrowserHistory } from 'history'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'bootstrap'

// src modules
import reduceJoyce from './reducers/reduceJoyce'
import actions from './actions'
import { logger, joyceAPI, joyceInterface, joyceRouter, joycePaginate, googleAuth } from './middleware/'
import NavbarContainer from './containers/navbarContainer'
import ReaderPageContainer from './containers/readerPageContainer'
import EditorPageContainer from './containers/editorPageContainer'
import SearchPageContainer from './containers/searchPageContainer'
import AdminPageContainer from './containers/adminPageContainer'

const history = createBrowserHistory()

const routerMiddleware = createRouterMiddleware(history)
const store = configureStore({
	reducer: reduceJoyce(history), 
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false, immutableCheck:false}).prepend(routerMiddleware, logger, joyceAPI, joyceInterface, joyceRouter, joycePaginate, googleAuth)
})

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

const root = ReactDOM.createRoot(document.getElementById('wrapper'));
root.render(
	<GoogleOAuthProvider clientId={process.env.GOOGLE_AUTH_CLIENT_ID}>
		<Provider store={store}>
			<ReduxRouter history={history}>
				<div id='inner_wrapper'>
					<NavbarContainer/>
					<Routes>
						<Route path='/' element={<ReaderPageContainer />} >
							<Route path='/:id' element={<ReaderPageContainer />} />
						</Route>
						<Route path='notes' element={<ReaderPageContainer />} >
							<Route path=':id' element={<ReaderPageContainer />} />
						</Route>
						<Route path='edit' element={<EditorPageContainer />} >
							<Route path=':id' />
							<Route path='notes'>
								<Route path=':id' />
							</Route>
							<Route path='tags'>
								<Route path=':id' />
							</Route>
							<Route path='editions'>
								<Route path=':id' />
							</Route>
							<Route path='media'>
								<Route path=':id' />
							</Route>
						</Route>
						<Route path='search' element={<SearchPageContainer />} />
						<Route path='admin' element={<AdminPageContainer />} />
					</Routes>					
				</div>
			</ReduxRouter>
		</Provider>
	</GoogleOAuthProvider>
)