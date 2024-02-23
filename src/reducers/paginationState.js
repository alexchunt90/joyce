import {returnEditorStateFromBlocksArray} from '../modules/editorSettings'

const initialState = {
	paginationEdition: undefined,
	currentPage: undefined,
	editorState: undefined,
	documents: {}
}

const setStateWithPaginatedDoc = (edition, state) => {
	const year = edition.year
	const firstPage = edition.doc[0]
	const entityMap = edition.entityMap
	const pageEditorState = returnEditorStateFromBlocksArray(firstPage.blocks, entityMap)
	const newDocumentsState = {
		...state.documents,
		[year]: edition
	}
	return {
		...state,
		currentPage: firstPage.number,
		documents: newDocumentsState,
		editorState: pageEditorState
	}	
}

const paginationState = (state=initialState, action) => {
	switch(action.type) {
		case 'SET_PAGINATION_EDITION':
			return {
				...state,
				paginationEdition: action.data,
			}
		case 'ADD_PAGINATED_DOCUMENT':
			return setStateWithPaginatedDoc(action.data, state)
		case 'CHANGE_PAGINATED_DOCUMENT':
			return setStateWithPaginatedDoc(action.data, state)
		case 'CHANGE_SELECTED_PAGE':
			const currentEdition = state.paginationEdition
			const currentDoc = state.documents[currentEdition.year]
			const newPage = currentDoc.doc.find(p => p.number === action.data)
			const newPageEditorState = returnEditorStateFromBlocksArray(newPage.blocks, currentDoc.entityMap)
			return {
				...state,
				currentPage: newPage.number,
				editorState: newPageEditorState,
			}
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'currentDocument') {
				return initialState
			}
		default:
			return state
	}
}

export default paginationState