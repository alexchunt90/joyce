const highlightActive = (state=false, action) => {
	switch(action.type) {
		case 'TOGGLE_HIGHLIGHT':
			return !state
		default:
			return state
	}
}

export default highlightActive