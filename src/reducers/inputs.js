import regex from '../modules/regex'

const initialState = {
	documentTitle: '',
	documentNumber: '',
	search: '',
	filterInput: '',
	pageNumber: '',
	colorPicker: '',
	externalURL: '',
	noteMediaSelection: [],
	editionYear: undefined,
	uploadFile: undefined,
	searchResultCount: 10,
	searchDocTypes: {
		'chapters': true,
		'notes': true,
		'info': true,
	}
}

const inputs = (state=initialState, action) => {
	switch(action.type) {
		// Set Inputs after getting new document
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.docType  === 'chapters' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title,
					filterInput: ''
				}
			} else if (action.status === 'success' && action.docType === 'notes' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title,
					noteMediaSelection: action.data.media_doc_ids,
					filterInput: '',
				}
			} else if (action.status === 'success' && action.docType === 'info' && action.state === 'currentDocument') {
				return {
					...state,
					documentTitle: action.data.title,
					documentNumber: action.data.number,
					filterInput: '',
				}				
			} else if (action.status === 'success' && action.docType === 'tags') {
				return {
					...state,
					documentTitle: action.data.title,
					colorPicker: action.data.color,
					filterInput: ''
				}
			} else if (action.status === 'success' && action.docType === 'editions') {
				return {
					...state,
					documentTitle: action.data.title,
					editionYear: action.data.year.toString(),
					filterInput: ''
				}									
			} else if (action.status === 'success' && action.docType === 'media' && action.state === 'currentDocument') {
				if (action.data.type === 'yt') {
					return {
						...state,
						documentTitle: action.data.title,
						filterInput: '',
						externalURL: action.data.youtube_url
					}					
				} else {
					return {
						...state,
						documentTitle: action.data.title,
						filterInput: '',
					}
				}
			} else { return state }

		// Doc Title
		case 'CREATE_DOCUMENT':
			return initialState
		case 'CANCEL_EDIT':
			return initialState
		case 'UPDATE_DOCUMENT_TITLE':
			return {
				...state,
				documentTitle: action.data
			}
		case 'UPDATE_URL_INPUT':
			return {
				...state,
				externalURL: action.data
			}
		case 'EXTERNAL_URL_CREATED':
			return {
				...state,
				externalURL: ''
			}
		case 'UPDATE_DOCUMENT_NUMBER':
			if (regex.checkIntegerInput(action.data)) {
				return {
					...state,
					documentNumber: action.data
				}
			}		
		case 'UPDATE_PAGE_NUMBER_INPUT':
			return {
				...state,
				pageNumber: action.data
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
		// Edition Year Input
		case 'UPDATE_EDITION_YEAR':
			if (regex.checkIntegerInput(action.data)) {
				return {
					...state,
					editionYear: action.data
				} 
			} else { 
				return state 
			}
		// Search
		case 'TOGGLE_SEARCH_DOCTYPE':
			let docTypeToggles = state.searchDocTypes
			docTypeToggles[action.docType] = !docTypeToggles[action.docType]
			return {
				...state,
				searchDocTypes: docTypeToggles
			}
		case 'UPDATE_SEARCH_RESULT_COUNT':
			return {
				...state,
				searchResultCount: action.count
			}
		case 'UPDATE_SEARCH_INPUT':
			return {
				...state,
				search: action.data
			}
		case 'UPDATE_FILTER_INPUT':
			return {
				...state,
				filterInput: action.data
			}
		// Color Picker
		case 'SAVE_DOCUMENT':
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