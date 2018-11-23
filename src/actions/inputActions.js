// -------------
// Input Actions
// -------------
// These actions handle states for the non-DraftJS input elements

const inputActions = {
	// Handle changes to the document title input box
	updateDocumentTitleInput: documentTitleInput =>
		({
			type: 'UPDATE_DOCUMENT_TITLE',
			data: documentTitleInput.target.value
		}),
	updateColorPickerInput: colorPickerInput =>
		({
			type: 'UPDATE_COLOR_PICKER',
			data: colorPickerInput.target.value
		}),
	// Handle changes to the search input box
	updateSearchInput: searchInput =>
		({
			type: 'UPDATE_SEARCH_INPUT',
			data: searchInput.target.value
		})
}

export default inputActions