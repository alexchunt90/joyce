const annotationTag = (state={}, action) => {
	switch(action.type) {
		case 'SET_ANNOTATION_TAG':
			return action.data
		case 'SUBMIT_ANNOTATION':
			return {}
		case 'CLEAR_ANNOTATION_TAG':
			return {}		
		default:
			return state
	}
}

export default annotationTag