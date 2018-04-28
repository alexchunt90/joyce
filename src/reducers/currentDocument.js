const currentDocument = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.state === 'currentDocument') {
				return action.data
			} else if (action.status ==='request' && action.state === 'currentDocument') {
				return {}
			}
			else { return state }
		case 'DELETE_DOCUMENT':
			if (action.status === 'success' && action.data.length <= 0) {
				return {}
			}
		case 'CREATE_DOCUMENT':
			return {id: null, number: null, title: '', html_source: ''}	
		default:
			return state
	}
}

export default currentDocument