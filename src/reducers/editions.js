const editions = (state=[], action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'success' && action.docType === 'editions') {
				return action.data
			} else { return state }
		case 'DELETE_DOCUMENT':
			if (action.status === 'success' && action.docType === 'editions') {
				return action.data
			} else { return state }
		case 'SAVE_DOCUMENT':
			if (action.status === 'success' && action.docType === 'editions') {
				return action.data
			} else { return state }
		default: 
			return state
	}
}

export default editions