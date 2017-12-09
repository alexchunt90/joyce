const mode = (state='READ_MODE', action) => {
	switch(action.type) {
		case 'SET_READ_MODE':
			return 'READ_MODE'
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'notes') {
				return 'READ_MODE'
			} else { return state }
		case 'SET_EDIT_MODE':
			return 'EDIT_MODE'
		case 'CANCEL_EDIT':
			return 'READ_MODE'
		default:
			return state
	}
}

export default mode