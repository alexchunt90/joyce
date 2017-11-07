const setCurrentChapter = id =>
	({
		type: 'GET_TEXT_DATA',
		id: id
	})

const toggleHighlight = id =>
	({
		type: 'TOGGLE_HIGHLIGHT'
	})
	
export {
	setCurrentChapter,
	toggleHighlight
}