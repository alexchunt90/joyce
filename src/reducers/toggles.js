const initialState = {
	loading: true,
	loadingPagination: true,
	highlights: true,
	pagination: false,
	admin: false,
}

const toggles = (state=initialState, action) => {
	switch(action.type) {
		// Loading
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'currentDocument') {
				return {
					...state,
					loading: true
				}
			} else if (action.status === 'success' && action.state === 'currentDocument') {
				return {
					...state,
					loading: false
				}
			}
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'success' && !action.data[0] && action.state === 'currentDocType') {
			// if (action.status === 'success' && action.state === 'currentDocType') {
				return {
					...state,
					loading: false
				}
			}
		case 'CREATE_DOCUMENT':
			return {
				...state,
				loading: false
			}		
		// Highlights
		case 'TOGGLE_HIGHLIGHT':
			return {
				...state,
				highlights: !state.highlights
			}
		// Pagination in chapter reader
		case 'TOGGLE_PAGINATION':
			return {
				...state,
				pagination: !state.pagination
			}
		// Pagination loading while frontend builds pagination object
		case 'SET_PAGINATION_EDITION':
			return {
				...state,
				loadingPagination: true
			}
		// Admin
		case 'SHOW_ADMIN_HEADER':
			return {
				...state,
				admin: true
			}		
		case 'HIDE_ADMIN_HEADER':
			return {
				...state,
				admin: false
			}
		default:
			return state
	}
}

export default toggles