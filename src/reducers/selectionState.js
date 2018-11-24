const selectionState = (state={}, action) => {
	switch(action.type) {
		case 'ADD_ANNOTATION':
			return action.data
		case 'ANNOTATION_CREATED':
			return {}			
		default:
			return state
	}
}

export default selectionState