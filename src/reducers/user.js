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
			// A failed login must not fall through to USER_LOGIN_REFRESH below,
			// which would report the user as signed in.
			return state
		case 'USER_LOGOUT_RESPONSE':
			if (action.status === 'success') {
				return defaultState
			}
			// A failed logout leaves the existing session intact.
			return state
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