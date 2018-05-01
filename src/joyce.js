// node_modules
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import 'bootstrap'

// src packages
import Navbar from './containers/navbar'
import reduceReader from './reducers/reduceReader'
import { selectAnnotationNote } from './actions/userActions'
import { getDocumentList } from './actions/apiActions'
import DeleteConfirmModal from './components/deleteConfirmModal'
import AnnotateModal from './components/annotateModal'
import AnnotationModal from './components/annotationModal'
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
				<Navbar />
				<Route exact path='/edit' render={() => {
					const currentDocument = store.getState().currentDocument
					if (store.getState().docType === 'chapters') {
						if (currentDocument.id) {
							return <Redirect to={'/edit/' + currentDocument.number}/> 
						} else {
							return <Redirect to={'/edit/1'}/>
						}
					}
				}}/>
				<Route exact path='/notes' render={() => {
					if (store.getState().notes[0]) {
						return <Redirect to={'/notes/' + store.getState().notes[0].id} />
					}
					return <JoyceReaderPageContainer />
				}}/>
				<Route exact path='/notes/:id' component={JoyceReaderPageContainer} />
				<Route exact path='/edit/:id' component={JoyceEditorPageContainer} />
				<Route exact path='/:id' component={JoyceReaderPageContainer} />
				<DeleteConfirmModal onDeleteClick={()=>onDeleteClick(currentDocument.id, docType)}/>
				<AnnotateModal notes={store.getState().notes} annotationNote={store.getState().annotationNote} onSubmitClick={()=>onSubmitAnnotationClick(store.getState().annotationNote, store.getState().selectionState, store.getState().editorState)} selectAnnotationNote={selectAnnotationNote} />
				<AnnotationModal annotationNote={store.getState().annotationNote} />
			</div>
		</ConnectedRouter>
	</Provider>,
  	document.getElementById('wrapper')
)

store.dispatch(getDocumentList({
	docType: docType,
	state: 'initialPageLoad'
}))
store.dispatch(getDocumentList({docType: 'notes'}))