const currentDocument = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				return action.data
			} else { return state }
		case 'CREATE_DOCUMENT':
			return {id: null, number: null, title: '', text: ''}		
		default:
			return state
	}
}

export default currentDocument