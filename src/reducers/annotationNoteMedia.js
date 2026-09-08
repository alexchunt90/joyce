const annotationNoteMedia = (state=[], action) => {
	switch(action.type) {
		// Clear the previous note's media as soon as a new modal note is requested, so a
		// note without images does not keep showing the images of the one read before it
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'annotationNote') {
				return []
			} else {return state}
		case 'GET_MEDIA_DOCS':
			if (action.status === 'success' && action.modalNote === true) {
				return action.data
			} else {return state}
		case 'SET_CURRENT_DOCUMENT':
			return []
		default:
			return state
	}
}

export default annotationNoteMedia