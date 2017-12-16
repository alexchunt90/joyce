const loadingToggle = (state=true, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'currentDocument') {
				return true
			} else if (action.status === 'success' && action.state === 'currentDocument') {
				return false
			}
		default:
			return state
	}
}

export default loadingToggle