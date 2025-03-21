const annotationNoteMedia = (state=[], action) => {
	switch(action.type) {
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