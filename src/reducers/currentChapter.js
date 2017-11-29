const currentChapter = (state={}, action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'success' && action.docType === 'chapters') {
				console.log(action.data)
				return action.data
			} else { return state }
		case 'CREATE_CHAPTER':
			return {id: null, number: null, title: '', text: ''}
		case 'UPDATE_EDITED_CHAPTER':
			return action.data
		default:
			return state
	}
}

export default currentChapter