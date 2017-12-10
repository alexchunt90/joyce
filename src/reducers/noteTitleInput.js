const noteTitleInput = (state='', action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentNote') {
				return action.data.title
			} else { return state }
		case 'CREATE_NOTE':
			return ''
		case 'UPDATE_NOTE_TITLE':
			return action.data
		default:
			return state
	}
}

export default noteTitleInput