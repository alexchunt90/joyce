// -------------
// Input Actions
// -------------
// These actions handle states for the non-DraftJS input elements

const inputActions = {
	// Handle changes to the document title input box
	updateDocumentTitleInput: input =>
		({
			type: 'UPDATE_DOCUMENT_TITLE',
			data: input.target.value
		}),
	updateDocumentNumberInput: input =>
		({
			type: 'UPDATE_DOCUMENT_NUMBER',
			data: input.target.value
		}),		
	updatePageNumberInput: input =>
		({
			type: 'UPDATE_PAGE_NUMBER_INPUT',
			data: input.target.value
		}),
	updateEditionYearInput: input =>
		({
			type: 'UPDATE_EDITION_YEAR',
			data: input.target.value
		}),	
	updateColorPickerInput: input =>
		({
			type: 'UPDATE_COLOR_PICKER',
			data: input.target.value
		}),
	// Handle changes to the search input box
	updateSearchInput: input =>
		({
			type: 'UPDATE_SEARCH_INPUT',
			data: input.target.value
		}),
	// Handle changes to the file upload input for media docs
	updateMediaInput: input => 
		({
			type: 'UPDATE_MEDIA_INPUT',
			data: input.target.files
		}),
	toggleMediaCheckbox: id =>
		({
			type: 'TOGGLE_MEDIA_CHECKBOX',
			id: id
		})
}

export default inputActions