const annotationNote = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'notes' && action.state === 'annotationNote') {
				return action.data
			} else { return state }
		case 'SUBMIT_ANNOTATION':
			return {}
		default:
			return state
	}
}

export default annotationNote