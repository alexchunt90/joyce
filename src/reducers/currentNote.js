const currentNote = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'notes') {
				return action.data
			} else { return state }
		case 'CREATE_NOTE':
			return {id: null, number: null, title: '', text: ''}		
		default:
			return state
	}
}

export default currentNote