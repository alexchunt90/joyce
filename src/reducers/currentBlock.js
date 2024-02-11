const initialState = {id: undefined, key: undefined}

const currentDocument = (state=initialState, action) => {
	switch(action.type) {
		case 'SET_CURRENT_BLOCK':
			return {id: action.id, key: action.key}
		case 'UNSET_CURRENT_BLOCK':
			return initialState
		default:
			return state
	}
}

export default currentDocument