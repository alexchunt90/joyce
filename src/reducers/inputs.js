const initialState = {
	documentTitle: '',
	search: '',
	colorPicker: '',
	noteMediaSelection: [],
	uploadFile: undefined
}

const inputs = (state=initialState, action) => {
	switch(action.type) {
		// Set Inputs after getting new document
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.docType  === 'chapters' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title
				}
			} else if (action.status === 'success' && action.docType === 'notes' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title,
					noteMediaSelection: action.data.media_doc_ids,
				}
			} else if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					documentTitle: action.data.title,
					colorPicker: action.data.color
				}						
			} else if (action.status === 'success' && action.docType === 'media' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title,
				}
			} else { return state }

		// Doc Title
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
		// Note-attached media
		case 'TOGGLE_MEDIA_CHECKBOX':
			const note_media_id = action.id
			const selectedNotes = state.noteMediaSelection
			let newSelection = selectedNotes
			if (selectedNotes.indexOf(note_media_id) < 0) {
				// If selected note id is not in the array, push it
				newSelection = [...selectedNotes, note_media_id]
			} else {
				// If selected note id is in the array, pop it off
				newSelection = selectedNotes.filter((id)=>{
					return id !== note_media_id
				})
			}
			return {
				...state,
				noteMediaSelection: newSelection
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