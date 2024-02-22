import { validateSubmittedDocument, validateSubmittedAnnotation } from '../modules/validation'

const userErrors = (state=[], action) => {
	switch(action.type) {
		case 'RETURN_EDITOR_VALIDATION_ERRORS':
			return action.errors
		case 'SUBMIT_ANNOTATION':
			return validateSubmittedAnnotation(action.annotationNote, action.annotationTag)
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument') {
				return []
			}
		case 'OAUTH_TOKEN_AUTHORIZATION':
			if (action.status === 'error') {
				return ['Login Failed.']
			} else if (action.status === 'success') {
				return []
			}
		case 'USER_LOGOUT_RESPONSE':
			if (action.status === 'error') {
				return ['Logout failed. Clear your cookies or contact system admin.']
			} else if (action.status === 'success') {
				return []
			}
		case 'SAVE_DOCUMENT':
			if (action.status === 'error') {
				if (data.response.status === 401) {
					return [...state, 'The API refused your request. Try logging out and back in again in another tab.']
				} else {
					return [...state, 'The system encountered a problem. Contact your system admin.']
				}
			}
		case 'DELETE_DOCUMENT':
			if (action.status === 'error') {
				if (data.response.status === 401) {
					return [...state, 'The API refused your request. Try logging out and back in again in another tab.']
				} else {
					return [...state, 'The system encountered a problem. Contact your system admin.']
				}
			}	
		default:
			return state
	}
}

export default userErrors