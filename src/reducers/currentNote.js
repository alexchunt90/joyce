const currentNote = (state={}, action) => {
	switch(action.type) {
		case 'GET_NOTE_DATA_RECEIVED':
			return action.data
		case 'UPDATE_EDITED_NOTE':
			return action.data
		default:
			return state
	}
}

export default currentNote