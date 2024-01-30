import actions from '../actions'
import api from '../modules/api'

const googleAuth = store => next => action => {
 	
	next(action)
	switch(action.type) {
		case 'OAUTH_CONSENT_SUCCESS':
			api.HTTPPostOAuthToken(action.credential).then(response =>
				store.dispatch(actions.googleTokenAuthorization(response))
			)
			break
		case 'USER_LOGOUT_REQUEST':
			api.HTTPPostLogout().then(response=>
				store.dispatch(actions.userLogoutResponse(response.status))
			)
		default:
			break
	}
}

export default googleAuth