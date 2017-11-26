const currentNote = (state={}, action) => {
	switch(action.type) {
		case 'UPDATE_EDITED_NOTE':
			return action.data
		default:
			return state
	}
}

export default currentNote