const initialState = {
	documentTitle: '',
	search: '',
	colorPicker: '',
	fileUpload: undefined
}

const inputs = (state=initialState, action) => {
	switch(action.type) {
		// Document Title
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title
				}
			} else { return state }
		case 'CREATE_DOCUMENT':
			return {
					...state,
					documentTitle: ''
			}
		case 'UPDATE_DOCUMENT_TITLE':
			return {
					...state,
					documentTitle: action.data
			}
		// Search
		case 'UPDATE_SEARCH_INPUT':
			return {
				...state,
				search: action.data
			}
		// Color Picker
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					colorPicker: action.data.color
				}
			} else { return state }
		case 'SAVE_DOCUMENT': 
			if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					colorPicker: ''
				}
			} else { return state }			
		case 'CREATE_DOCUMENT':
			return {
				...state,
				colorPicker: ''
			}
		case 'SELECT_COLOR_SWATCH':
			return {
				...state,
				colorPicker: action.data
			}
		case 'UPDATE_COLOR_PICKER':
			return {
				...state,
				colorPicker: action.data.toUpperCase()
			}
		// Media Upload
		case 'UPDATE_MEDIA_INPUT':
			return {
				...state,
				fileUpload: action.data
			}
		default:
			return state
	}
}

export default inputs