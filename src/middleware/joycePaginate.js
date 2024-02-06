import actions from '../actions'
import api from '../modules/api'
import helpers from '../modules/helpers'
import { validateSubmittedDocument, validateSubmittedAnnotation } from '../modules/validation'
import { 
	stateToHTML, 
	convertToSearchText, 
	returnEditorStateWithNewAnnotation,
	returnEditorStateFromHTML, 
	readerDecorator,
	returnEditorStateWithExpandedPageBreakSelection
} from '../modules/editorSettings.js'
import paginate from '../modules/paginate'

// Pagination Action Middleware
const joycePaginate = store => next => action => {
	next(action)
	const state = store.getState()
	const editions = state.editions
	const currentDocument = state.currentDocument
	const mode = state.mode
	const paginationState = state.paginationState
	switch(action.type) {		
		// 
		case 'SET_EDITOR_STATE':
			if (editions.length > 0) {
				const firstEdition = editions[0]
				// Paginated chapters take a long time to process, so we're putting them behind a promise
				
				// async function asyncPagination() {					
				// 	const paginationPromise = new Promise((resolve, reject)=> {
				// 		const createDocument = paginate(action.data, firstEdition)
				// 		if (createDocument) {
				// 			resolve(createDocument)
				// 		} else {
				// 			reject('Failed to paginate this chapter.')
				// 		}
				// 	})
				// 	const resultDoc = await paginationPromise
				// 	return resultDoc
				// }
				// const paginatedDoc = asyncPagination()

				const paginationPromise = new Promise((resolve, reject)=> {
					const createDocument = paginate(action.data, firstEdition)
					if (createDocument) {
						resolve(createDocument)
					} else {
						reject('Failed to paginate this chapter.')
					}
				})
				paginationPromise.then(response=> {
					store.dispatch(actions.addPaginatedDoc(response))	
					store.dispatch(actions.setPaginationEdition(firstEdition))
				}).catch(error=>
					console.log(error)
				)
			}			
		// This handles selecting the whole pagebreak entity if the cursor moves inside it
		case 'UPDATE_EDITOR_STATE':
			if (mode === 'PAGINATE_MODE') {
				// Take the incoming editorState and retrieve the selectionState
				const editorState = action.data
				const newEditorState = returnEditorStateWithExpandedPageBreakSelection(editorState)
				// returnEditorStateWithExpandedPageBreakSelection returns undefined if editorState doesn't meet criteria
				if (newEditorState) {
					store.dispatch(actions.updateEditorState(newEditorState))
				}
			}
			break
		case 'GET_DOCUMENT_LIST':
			// TODO: Figure out how to delay this till currentDoc and editions BOTH load, preventing race condition
			if (action.status === 'success' && action.docType === 'editions' && currentDocument.html_source) {
				const firstEdition = action.data[0]
				const editorState = returnEditorStateFromHTML(currentDocument.html_source, readerDecorator)
				const paginatedDoc = paginate(editorState, firstEdition)
				store.dispatch(actions.addPaginatedDoc(paginatedDoc))
			}
			break
		case 'SET_PAGINATION_EDITION':
			// Set the current edition and generate a new paginated doc if needed
			// Ignore if in editor pagination mode, as paginated doc isn't used
			if (paginationState.documents[action.data.year] === undefined && mode !== 'PAGINATION_MODE') {
				const selectedEdition = action.data
				const editorState = returnEditorStateFromHTML(currentDocument.html_source, readerDecorator)
				const paginatedDoc = paginate(editorState, selectedEdition)
				store.dispatch(actions.addPaginatedDoc(paginatedDoc))
			}
			break
	}
}

export default joycePaginate