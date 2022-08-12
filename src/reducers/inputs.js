const initialState = {
	documentTitle: '',
	search: '',
	colorPicker: '',
	noteMediaSelection: [],
	uploadFile: undefined
}

const inputs = (state=initialState, action) => {
	switch(action.type) {
		// Document Title
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument' && ['tags', 'media'].indexOf(action.docType) <= 0 ) {
				return {
					...state,
					documentTitle: action.data.title
				}
			} else if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					documentTitle: action.data.title,
					colorPicker: action.data.color
				}
			} else if (action.status === 'success' && action.state === 'currentDocument' && action.docType === 'media') {
				return {
					...state,
					documentTitle: action.data.title,
				}
			} else { return state }
		case 'CREATE_DOCUMENT':
			return {
					...state,
					documentTitle: ''
			}
		case 'CANCEL_EDIT':
			return initialState		
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
		case 'SAVE_DOCUMENT': 
			// TODO: Note the reference to inputs.uploadFile here, need to refactor
			if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					colorPicker: '',
					uploadFile: undefined
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
				uploadFile: action.data
			}
		case 'CLEAR_LOADED_MEDIA':
			return {
				...state,
				uploadFile: undefined,
			}
		default:
			return state
	}
}

export default inputs