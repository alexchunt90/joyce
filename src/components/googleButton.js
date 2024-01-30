import React from 'react'
import { GoogleLogin } from '@react-oauth/google'

import actions from '../actions'

const onLoginFailure = (error) => {
	console.log('LOGIN FAILED!')
	console.log(error)
}

export const GoogleLoginButton = ({onConsentSuccess}) =>
	<div id='sign_in_button' className='google_button'>
		<GoogleLogin
			onSuccess={credentialResponse => {
				onConsentSuccess(credentialResponse)
  			}}
			onError={() => {
    			console.log('Login Failed');
  			}}
		/>
	</div>