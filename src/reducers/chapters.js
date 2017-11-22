const chapters = (state=[], action) => {
	switch(action.type) {
		case 'GET_CHAPTER_DATA_RECEIVED':
			return action.data
		case 'DELETE_CHAPTER_SUCCESS':
			return action.data
		case 'SAVE_DOCUMENT_SUCCESS':
			return action.data
		default: 
			return state
	}
}

export default chapters