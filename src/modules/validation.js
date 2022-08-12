import regex from './regex'

export const validateSubmittedDocument = (docType, inputs) => {
	const errors = []
	if (docType === 'tags') {
		if (inputs.colorPicker.length < 1) {
			errors.push('Please select a tag color.')
		} else if (!regex.checkColorPickerHexValue(inputs.colorPicker)) {
			errors.push('Please select a valid hex code color.')
		}
	}
	if (docType === 'media') {
		if (inputs.uploadFile === undefined) {
			errors.push('Please choose an image first.')
		} else {
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

export const validateSubmittedAnnotation = (annotationNote, annotationTag) => {
	const errors = []
	if (!annotationNote.id) {
		errors.push('Please choose a note.')
	}
	if (!annotationTag.id) {
		errors.push('Please choose a tag.')
	}
	return errors
}