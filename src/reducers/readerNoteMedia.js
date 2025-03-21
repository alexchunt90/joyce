const readerNoteMedia = (state=[], action) => {
	switch(action.type) {
		case 'GET_MEDIA_DOCS':
			if (action.status === 'success' && action.modalNote === false) {
				return action.data
			} else {return state}
		case 'SET_CURRENT_DOCUMENT':
			return []
		default:
			return state
	}
}

export default readerNoteMedia