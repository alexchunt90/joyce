const chapters = (state=[], action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'success' && action.docType === 'chapters') {
				return action.data
			} else { return state }
		case 'DELETE_DOCUMENT':
			if (action.status === 'success' && action.docType === 'chapters') {
				return action.data
			} else { return state }
		default: 
			return state
	}
}

export default chapters