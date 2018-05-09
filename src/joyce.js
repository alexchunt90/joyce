// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import 'bootstrap'

// src packages
import Navbar from './components/navbar'
import reduceReader from './reducers/reduceReader'
import DeleteConfirmModal from './components/deleteConfirmModal'
import AnnotateModal from './components/annotateModal'
import AnnotationModal from './components/annotationModal'
import actions from './actions'
import { logger, joyceAPI, joyceInterface, joyceRouter } from './middleware/'
import JoyceReaderPageContainer from './containers/joyceReaderPageContainer'
import JoyceEditorPageContainer from './containers/joyceEditorPageContainer'
import JoyceSearchPageContainer from './containers/joyceSearchPageContainer'

const history = createHistory()
const router = routerMiddleware(history)
const store = createStore(reduceReader, applyMiddleware(logger, router, joyceAPI, joyceInterface, joyceRouter))	

console.log(actions)
store.dispatch(actions.getDocumentList({docType: 'chapters'}))
store.dispatch(actions.getDocumentList({docType: 'notes'}))

// TODO: Modal container should probably get state and dispatch as props, not access store

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
					<Route exact path='/notes/:id' component={JoyceReaderPageContainer} />
					<Route exact path='/edit/:id' component={JoyceEditorPageContainer} />
					<Route exact path='/edit/notes/:id' component={JoyceEditorPageContainer} />
					<Route exact path='/search/' component={JoyceSearchPageContainer} />
					<Route exact path='/:id' component={JoyceReaderPageContainer} />	
				</Switch>
				<DeleteConfirmModal onDeleteClick={()=>onDeleteClick(currentDocument.id, docType)}/>
				<AnnotateModal notes={store.getState().notes} annotationNote={store.getState().annotationNote} onSubmitClick={()=>onSubmitAnnotationClick(store.getState().annotationNote, store.getState().selectionState, store.getState().editorState)} selectAnnotationNote={actions.selectAnnotationNote} />
				<AnnotationModal annotationNote={store.getState().annotationNote} />
			</div>
		</ConnectedRouter>
	</Provider>,
  	document.getElementById('wrapper')
)