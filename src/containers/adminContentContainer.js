import React from 'react'
import { useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import api from '../modules/api'
import actions from '../actions'
import { GoogleLoginButton } from '../components/googleButton'
import { LogoutButton } from '../components/button'

const refreshElasticsearch = () => {
	api.HTTPGetRefreshList().then(response =>
		console.log(response)
	)
}

const AdminContent = ({user, userErrors, onConsentSuccess, onLogoutClick, refreshElasticsearch}) => {
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
			<div className='row'></div>
			{user.isLoggedIn && 			
				<div className='row'>
					<div id='refresh' className='col-sm-8'>
						<button type='button' className='btn btn-sm btn-outline-primary' onClick={refreshElasticsearch}>
							Refresh Seed Data
						</button>
						<p>This will send a message to the server to wipe all data, and reimport a clean copy of the old JoyceProject.com site. The process takes about 20 minutes</p>
					</div>
				</div>
			}
			<div className='row' className='col-sm-8'>
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