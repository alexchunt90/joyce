const loadingToggle = (state=true, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'currentDocument') {
				return true
			} else if (action.status === 'success' && action.state === 'currentDocument') {
				return false
			}
		case 'GET_DOCUMENT_LIST':
			// TODO: How should this handle multiple docTypes?
			if (action.status === 'success' && !action.data[0] && action.state === 'currentDocType') {
				return false
			}
		default:
			return state
	}
}

export default loadingToggle