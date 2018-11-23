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