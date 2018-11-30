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