const annotationNote = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'notes' && action.state === 'annotationNote') {
				return action.data
			} else { return state }
		case 'ADD_ANNOTATION':
			return {}
		case 'ANNOTATION_CREATED':
			return {}
		default:
			return state
	}
}

export default annotationNote