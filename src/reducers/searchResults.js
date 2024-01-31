const searchResults = (state={}, action) => {
	switch(action.type) {
		case 'GET_SEARCH_RESULTS':
			if (action.status === 'success') {
				return action.data
			} else { return state }
		default:
			return state
	}
}

export default searchResults