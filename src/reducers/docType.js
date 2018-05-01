const docType = (state=null, action) => {
	switch(action.type) {
		case 'SET_DOC_TYPE':
			return action.docType
		case '@@router/LOCATION_CHANGE':
			const path = action.payload.pathname
			if (/^\/(notes).*/.exec(path)) {
				return 'notes'
			} else { return state }
		default:
			return state
	}
}

export default docType