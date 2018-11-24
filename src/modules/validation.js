import regex from './regex'

export const validateSubmittedDocument = (docType, documentTitleInput, colorPickerInput) => {
	const errors = []
	if (docType === 'tags') {
		if (colorPickerInput.length < 1) {
			errors.push('Please select a tag color.')
		} else if (!regex.checkColorPickerHexValue(colorPickerInput)) {
			errors.push('Please select a valid hex code color.')
		}
	}
	if (documentTitleInput.length < 1) {
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