const colorPickerInput = (state='', action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument' && action.docType === 'tags') {
				return action.data.color
			} else { return state }
		case 'CREATE_DOCUMENT':
			return ''
		case 'SELECT_COLOR_SWATCH':
			return action.data
		case 'UPDATE_COLOR_PICKER':
			return action.data.toUpperCase()
		default:
			return state
	}
}

export default colorPickerInput