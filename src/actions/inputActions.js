//
// Input Actions
//
	// These actions handle states for the non-DraftJS input elements

	// Handle changes to the document title input box
	export const updateDocumentTitleChange = documentTitleInput => {
		return ({
			type: 'UPDATE_DOCUMENT_TITLE',
			data: documentTitleInput.target.value
		})
	}

	// Handle changes to the search input box
	export const updateSearchInput = searchInput => {
		return ({
			type: 'UPDATE_SEARCH_INPUT',
			data: searchInput.target.value
		})		
	}