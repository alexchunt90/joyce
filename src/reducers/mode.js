const mode = (state='READ_MODE', action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentNote') {
				return 'READ_MODE'
			} else { return state }
		case 'SAVE_DOCUMENT':
			if (action.status === 'success') {
				return 'READ_MODE'
			} else { return state }
		case 'SET_MODE':
			return action.mode
		case 'CREATE_NOTE':
			return 'EDIT_MODE'
		case 'CANCEL_EDIT':
			return 'READ_MODE'
		default:
			return state
	}
}

export default mode