const initialState = {
	paginationEdition: {},
}

const paginationState = (state=initialState, action) => {
	switch(action.type) {
		case 'SET_PAGINATION_EDITION':
			return {
				...state,
				paginationEdition: action.data,
			}
		default:
			return state
	}
}

export default paginationState