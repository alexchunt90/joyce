import actions from '../actions'
import api from '../modules/api'
import helpers from '../modules/helpers'
import { validateSubmittedDocument } from '../modules/validation'
import { 
	stateToHTML, 
	readerDecorator,
	convertToSearchText
} from '../modules/editorSettings'
import editorConstructor from '../modules/editorConstructor'
import paginate from '../modules/paginate'

// A chapter has no pages in an edition it carries no page breaks for, which is
// ordinary — not every chapter is paginated for every edition. Storing a pageless
// document is what crashed: paginationState's setStateWithPaginatedDoc reads
// edition.doc[0].blocks to build the first page's editorState.
//
// readerContentContainer already falls back to the unpaginated view when an edition
// has no stored document, so declining to store one degrades cleanly.
const hasPages = paginatedDoc => Boolean(paginatedDoc && paginatedDoc.doc && paginatedDoc.doc.length)

// Pagination Action Middleware
const joycePaginate = store => next => action => {
	next(action)
	const state = store.getState()
	const docType = state.docType
	const editions = state.editions
	const currentDocument = state.currentDocument
	const editorState = state.editorState
	const mode = state.mode
	const toggles = state.toggles
	const paginationState = state.paginationState
	switch(action.type) {		
		// 
		case 'SET_EDITOR_STATE':
			// Using set timeout to ensure setting editorState isn't delayed by pagination
			if (docType === 'chapters') {
				setTimeout(()=> {
					store.dispatch(actions.loadPagination())
				}, 100)
			}
			break
		case 'LOAD_PAGINATION':
			if (editions.length > 0 && docType === 'chapters') {
				const firstEdition = editions[0]
				// const paginatedDoc = paginate(action.editorState, firstEdition)
				// store.dispatch(actions.addPaginatedDoc(paginatedDoc))
				store.dispatch(actions.setPaginationEdition(firstEdition))
			}
			break	
		// This handles selecting the whole pagebreak entity if the cursor moves inside it
		case 'UPDATE_EDITOR_STATE':
			if (mode === 'PAGINATE_MODE') {
				// Take the incoming editorState and retrieve the selectionState
				const editorState = action.data
				const newEditorState = editorConstructor.returnEditorStateWithExpandedPageBreakSelection(editorState)
				// returnEditorStateWithExpandedPageBreakSelection returns undefined if editorState doesn't meet criteria
				if (newEditorState) {
					store.dispatch(actions.updateEditorState(newEditorState))
				}
			}
			break
		case 'GET_DOCUMENT_LIST':
			// TODO: Figure out how to delay this till currentDoc and editions BOTH load, preventing race condition
			if (action.status === 'success' && action.docType === 'editions' && docType ==='chapters' && currentDocument.html_source) {
				const firstEdition = action.data[0]
				const editorState = editorConstructor.returnEditorStateFromHTML(currentDocument.html_source, readerDecorator)
				const paginatedDoc = paginate(editorState, firstEdition)
				if (hasPages(paginatedDoc)) {
					store.dispatch(actions.addPaginatedDoc(paginatedDoc))
				}
			}
			break
		case 'CHOOSE_PAGINATION_EDITION':
			// If we're choosing an edition that's already paginated, render that:
			if (action.data.year in paginationState.documents) {
				const existingPaginatedDoc = paginationState.documents[action.data.year]
				store.dispatch(actions.changePaginatedDoc(existingPaginatedDoc))
			// If not, paginate the edition:
			} else {
				store.dispatch(actions.setPaginationEdition(action.data))
			}
			break
		case 'SET_PAGINATION_EDITION':
			// Set the current edition and generate a new paginated doc if needed
			// Ignore if in editor pagination mode, as paginated doc isn't used
			if (paginationState.documents[action.data.year] === undefined && mode !== 'PAGINATION_MODE') {
				const paginatedDoc = paginate(editorState, action.data)
				if (hasPages(paginatedDoc)) {
					store.dispatch(actions.addPaginatedDoc(paginatedDoc))
				}
			}
			break

		case 'ADD_PAGINATED_DOCUMENT':
			
			break
	}
}

export default joycePaginate