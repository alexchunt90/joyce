const defaultState = {
	isLoggedIn: false
}

const user = (state=defaultState, action) => {
	switch(action.type) {
		case 'OAUTH_TOKEN_AUTHORIZATION':
			if (action.status === 'success') {
				return {
					user_name: action.data.user_name,
					isLoggedIn: true
				}
			}
		case 'USER_LOGOUT_RESPONSE':
			if (action.status === 'success') {
				return defaultState
			}
		case 'USER_LOGIN_REFRESH':
			return {
				user_name: action.user_name,
				isLoggedIn: true
			}
		default:
			return state
	}
}

export default user