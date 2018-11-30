import { validateSubmittedDocument, validateSubmittedAnnotation } from '../modules/validation'

const userErrors = (state=[], action) => {
	switch(action.type) {
		case 'SUBMIT_DOCUMENT_EDIT':
			return validateSubmittedDocument(action.docType, action.inputs)
		case 'SUBMIT_ANNOTATION':
			return validateSubmittedAnnotation(action.annotationNote, action.annotationTag)
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success' && action.state === 'currentDocument') {
				return []
			}
		default:
			return state
	}
}

export default userErrors