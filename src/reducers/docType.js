const docType = (state='chapters', action) => {
	switch(action.type) {
		case 'SET_DOC_TYPE':
			return action.docType
		case 'SET_CURRENT_DOCUMENT':
			return action.docType
		default:
			return state
	}
}

export default docType