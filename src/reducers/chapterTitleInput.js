const chapterTitleInput = (state='', action) => {
	switch(action.type) {
		case 'GET_DOCUMENT_TEXT': 
			if (action.status === 'success') {
				return action.data.title
			} else { return state }
		case 'CREATE_CHAPTER':
			if (action.chapterNumber) {
				return ''
			} else { return state }
		case 'UPDATE_CHAPTER_TITLE':
			return action.data
		default:
			return state
	}
}

export default chapterTitleInput