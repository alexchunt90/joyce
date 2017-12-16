const searchInput = (state='', action) => {
	switch(action.type) {
		case 'UPDATE_SEARCH_INPUT':
			return action.data
		default:
			return state
	}
}

export default searchInput