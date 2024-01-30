from flask import Blueprint, render_template, jsonify, request, make_response
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from google.oauth2 import id_token
from google.auth.transport import requests
import json

import config

google_auth_api = Blueprint('auth', __name__)
CORS(google_auth_api, supports_credentials=True, allow_headers='*')

''' Verify user identity using Google OAuth '''
@google_auth_api.route('/token/', methods=['POST'])
def verify_id_token():
	data=json.loads(request.data)
	credential_token = data['credential']
	idinfo = id_token.verify_oauth2_token(credential_token, requests.Request(), config.GOOGLE_AUTH_CLIENT_ID)
	
	google_email = idinfo['email']
	google_sub_id = idinfo['sub']
	given_name = idinfo['given_name']

	if google_email in config.ADMIN_EMAIL_ADDRESSES:
		response = make_response({'user_name': given_name})
		response.set_cookie('user_name', given_name, max_age=timedelta(days=45))

		access_token = create_access_token(identity=google_email)
		refresh_token = create_refresh_token(identity=google_email)

		set_access_cookies(response, access_token)
		set_refresh_cookies(response, refresh_token)

		return response, 201
	else:
		return 'Unauthorized User', 401

''' Automatically refresh access tokens close to expiring'''
@google_auth_api.after_request
def refresh_expiring_jwts(response):
	try:
		exp_timestamp = get_jwt()['exp']
		now = datetime.now(timezone.utc)
		target_timestamp = datetime.timestamp(now + timedelta(days=10))
		if target_timestamp > exp_timestamp:
			access_token = create_access_token(identity=get_jwt_identity())
			set_access_cookies(response, access_token)
		return response
	except:
		print('NO JWT FOUND')
		return response

''' Logout user '''
@google_auth_api.route('/logout/', methods=['POST'])
def logout():
	response = make_response()
	response.delete_cookie('user_name')
	unset_jwt_cookies(response)
	return response, 200