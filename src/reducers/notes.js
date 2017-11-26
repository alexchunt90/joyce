const notes = (state=[], action) => {
	switch(action.type) {
		case 'GET_NOTE_DATA_RECEIVED':
			return action.data
		case 'DELETE_NOTE_SUCCESS':
			return action.data
		case 'SAVE_NOTE_SUCCESS':
			return action.data
		default: 
			return state
	}
}

export default notes