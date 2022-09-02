import {returnEditorStateFromBlocksArray} from '../modules/editorSettings'

const initialState = {
	paginationEdition: undefined,
	currentPage: undefined,
	editorState: undefined,
	documents: {}
}

const paginationState = (state=initialState, action) => {
	switch(action.type) {
		case 'SET_PAGINATION_EDITION':
			return {
				...state,
				paginationEdition: action.data,
			}
		case 'ADD_PAGINATED_DOCUMENT':
			const year = action.data.year
			const firstPage = action.data.doc[0]
			const entityMap = action.data.entityMap
			const pageEditorState = returnEditorStateFromBlocksArray(firstPage.blocks, entityMap)
			const newDocumentsState = {
				...state.documents,
				[year]: action.data
			}
			return {
				...state,
				currentPage: firstPage.number,
				documents: newDocumentsState,
				editorState: pageEditorState		
			}
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
		default:
			return state
	}
}

export default paginationState