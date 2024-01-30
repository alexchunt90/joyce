import React from 'react'
import { useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import actions from '../actions'
import { GoogleLoginButton } from '../components/googleButton'
import { LogoutButton } from '../components/button'

const AdminContent = ({user, userErrors, onConsentSuccess, onLogoutClick}) => {
	return (
		<div className='container'>
			{user.name &&
				<div className='row'>
					<p>Welcome, {user.name}.</p>
				</div>
			}
			<div className='row'>
				{!user.isLoggedIn && 
					<div className='col-sm-3'>
						<GoogleLoginButton onConsentSuccess={onConsentSuccess}/>
					</div>
				}
				{user.isLoggedIn && 
					<div className='col-sm-2'>
						<LogoutButton onClick={onLogoutClick} />
					</div>
				}
			</div>
			<div className='row'>
				<div id='user_errors'>
					{userErrors.map(error =>
						<div key={error} className='user_error_message'>{error}</div>
					)}
				</div>
			</div>
		</div>
	)
}		

const mapStateToProps = state => {
	return {
		user: state.user,
		userErrors: state.userErrors
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onConsentSuccess: response => {
			dispatch(actions.consentSuccess(response))
		},
		onLogoutClick: response => {
			dispatch(actions.userLogout())
		}		
	}
}

const AdminContentContainer = connect(mapStateToProps, mapDispatchToProps)(AdminContent)

export default AdminContentContainer