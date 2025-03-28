import regex from './regex'

export const validateSubmittedDocument = (docType, inputs, currentDocument, user) => {
	const errors = []
	if (user.isLoggedIn === false) {
		errors.push('You must log in to make edits.')
	}
	if (docType === 'tags') {
		if (inputs.colorPicker.length < 1) {
			errors.push('Please select a tag color.')
		} else if (!regex.checkColorPickerHexValue(inputs.colorPicker)) {
			errors.push('Please select a valid hex code color.')
		}
	}
	if (docType === 'editions') {
		const year = inputs.editionYear
		if (!year) {
			errors.push('Please enter the edition year.')
		}
		if (year && parseInt(year) === NaN) {
			errors.push('Year must be an integer.')
		}
	}
	if (docType === 'info') {
		const number = inputs.documentNumber
		if (number === '') {
			errors.push('Info pages must have a number for sorting.')
		}
	}
	if (docType === 'media') {
		if (!currentDocument.id && (inputs.uploadFile === undefined && inputs.externalURL == '')) {
			errors.push('Please choose an image or YouTube video first.')
		} 
		if (inputs.uploadFile !== undefined) {
			const allowedFileTypes = [
				'image/jpeg',
				'image/png'
			]
			const fileType = inputs.uploadFile[0].type
			if (!allowedFileTypes.includes(fileType)) {
				const file_type_error = 'You\'ve uploaded an image in an unsupported file type: '+ fileType
				errors.push(file_type_error)
			}
		}
	}
	if (inputs.documentTitle.length < 1) {
		errors.push('Please enter a title.')
	}
	return errors
}

export const validateSubmittedAnnotation = (annotationNote, annotationTag, docType) => {
	const errors = []
	if (!annotationNote.id) {
		errors.push('Please choose a note.')
	}
	if (!annotationTag.id && docType == 'chapters') {
		errors.push('Please choose a tag.')
	}
	return errors
}