import os
from dotenv import load_dotenv

load_dotenv()

MANIFEST_PATH = './static/js/manifest.json'

# Defaults to 'local' rather than None so that importing this module never depends on
# the environment being configured. Tests and the scripts under setup/ need to import
# config without a .env present.
# `or 'local'` rather than a getenv default, so an env var set to an empty string
# falls back too instead of yielding ''.
ENVIRONMENT = os.getenv('HOST_ENVIRONMENT') or 'local'

ELASTICSEARCH_LOCAL_HOST = 'http://localhost:9200'
ELASTICSEARCH_DOCKER_HOST = 'http://elasticsearch:9200'
# ELASTICSEARCH_STAGING_HOST = 'http://joyce-staging.net:9200'
# ELASTICSEARCH_PRODUCTION_HOST = 'http://joyceproject.com:9200'

SECRET_KEY = 'STATELY_PLUMP_BUCK_MULLIGAN'
GOOGLE_AUTH_CLIENT_ID = os.getenv('GOOGLE_AUTH_CLIENT_ID')

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_TOKEN_LOCATION = ['cookies']
JWT_COOKIE_SECURE = True

# Accepts commas with or without following whitespace, and ignores empty entries, so a
# missing or blank ADMIN_EMAIL_ADDRESSES yields an empty list instead of raising
# AttributeError on import. An empty list means nobody can authenticate as an editor,
# which is the safe failure for a misconfigured deployment.
_admins = os.getenv('ADMIN_EMAIL_ADDRESSES') or ''
ADMIN_EMAIL_ADDRESSES = [email.strip() for email in _admins.split(',') if email.strip()]

# Per-environment paths and cookie scope. Previously a chain of `if` statements, which
# left UPLOAD_FOLDER and COOKIE_DOMAIN undefined for any unrecognised HOST_ENVIRONMENT
# — the module imported fine and then failed with AttributeError much later, wherever
# the missing name happened to be read.
ENVIRONMENT_SETTINGS = {
    'local': {
        'UPLOAD_FOLDER': os.path.join(os.getcwd(), 'static'),
        'COOKIE_DOMAIN': '.localhost',
    },
    'docker': {
        'UPLOAD_FOLDER': '/usr/joyce/static',
        'COOKIE_DOMAIN': '.joyceproject.com',
    },
    'staging': {
        'UPLOAD_FOLDER': '/joyce/static',
        'COOKIE_DOMAIN': '.joyce-staging.net',
    },
    'production': {
        'UPLOAD_FOLDER': '/joyce/static',
        'COOKIE_DOMAIN': '.joyceproject.com',
    },
}

_settings = ENVIRONMENT_SETTINGS.get(ENVIRONMENT, ENVIRONMENT_SETTINGS['local'])
UPLOAD_FOLDER = _settings['UPLOAD_FOLDER']
COOKIE_DOMAIN = _settings['COOKIE_DOMAIN']

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mov', 'mp4', 'mp3', 'wav'}
