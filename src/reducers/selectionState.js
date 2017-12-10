const selectionState = (state={}, action) => {
	switch(action.type) {
		case 'ADD_ANNOTATION':
			return action.data
		case 'SUBMIT_ANNOTATION':
			return {}			
		default:
			return state
	}
}

export default selectionState