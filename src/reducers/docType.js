const docType = (state=null, action) => {
	switch(action.type) {
		case 'SET_DOC_TYPE':
			return action.docType
		default:
			return state
	}
}

export default docType