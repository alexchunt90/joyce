const currentChapter = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'chapters') {
				return action.data
			} else { return state }
		case 'CREATE_CHAPTER':
			if (action.chapterNumber) {
				return {number: action.chapterNumber, title: '', text: ''}
			} else { return state }
		case 'UPDATE_EDITED_CHAPTER':
			return action.data
		default:
			return state
	}
}

export default currentChapter