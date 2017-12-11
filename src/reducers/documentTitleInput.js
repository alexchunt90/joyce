const documentTitleInput = (state='', action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument') {
				return action.data.title
			} else { return state }
		case 'CREATE_DOCUMENT':
			return ''
		case 'UPDATE_DOCUMENT_TITLE':
			return action.data
		default:
			return state
	}
}

export default documentTitleInput