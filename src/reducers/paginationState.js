const initialState = {
	paginationToggle: false,
	paginationEdition: 'ed1932',
	currentPage: 0,
	currentPageEditionNumber: undefined
}

const paginationState = (state=initialState, action) => {
	switch(action.type) {
		case 'TOGGLE_PAGINATION_MODE':
			return {
				...state,
				paginationToggle: !state.paginationToggle,
			}
		default:
			return state
	}
}

export default paginationState