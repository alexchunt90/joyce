const chapterTitleInput = (state='', action) => {
	switch(action.type) {
		case 'UPDATE_EDITED_CHAPTER':
			return action.data.title
		case 'UPDATE_CHAPTER_TITLE':
			return action.data
		default:
			return state
	}
}

export default chapterTitleInput