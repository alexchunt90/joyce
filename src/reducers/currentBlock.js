const currentDocument = (state=null, action) => {
	switch(action.type) {
		case 'SELECT_CURRENT_BLOCK':
			return action.id
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				return null
			}
		default:
			return state
	}
}

export default currentDocument