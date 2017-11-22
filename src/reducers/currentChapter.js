const currentChapter = (state={}, action) => {
	switch(action.type) {
		case 'GET_TEXT_DATA_RECEIVED':
			return action.data
		case 'UPDATE_EDITED_CHAPTER':
			return action.data
		default:
			return state
	}
}

export default currentChapter