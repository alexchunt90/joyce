import os
from dotenv import load_dotenv

load_dotenv()

MANIFEST_PATH = './static/js/manifest.json'

ENVIRONMENT = os.getenv('HOST_ENVIRONMENT')
ELASTICSEARCH_LOCAL_HOST = 'http://127.0.0.1:9200'
ELASTICSEARCH_STAGING_HOST = 'http://joyce-staging.net:9200'

SECRET_KEY = 'STATELY_PLUMP_BUCK_MULLIGAN'
GOOGLE_AUTH_CLIENT_ID = os.getenv('GOOGLE_AUTH_CLIENT_ID')

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_TOKEN_LOCATION=['cookies']
JWT_COOKIE_SECURE=True

admins = os.getenv('ADMIN_EMAIL_ADDRESSES')
ADMIN_EMAIL_ADDRESSES = admins.split(', ')

if ENVIRONMENT == 'local':
	UPLOAD_FOLDER = os.path.join(os.getenv('HOME'), 'Projects', 'joyce_flask', 'static')
if ENVIRONMENT == 'staging':
	UPLOAD_FOLDER = '/joyce/static'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mov', 'mp4', 'mp3', 'wav'}