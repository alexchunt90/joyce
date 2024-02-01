from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import config

from blueprints.joyce import joyce
from blueprints.doc_api import doc_api
from blueprints.media_api import media_api
from blueprints.search_api import search_api
from blueprints.google_auth import google_auth_api

# Initialize application
application = Flask(__name__)

UPLOAD_FOLDER = './static'
config_params = {
    'ENV': config.ENVIRONMENT,
    'DEBUG': True,
    'UPLOAD_FOLDER': UPLOAD_FOLDER,
    'SECRET_KEY': config.SECRET_KEY,
    'JWT_COOKIE_SAMESITE': 'Lax',
    'JWT_SECRET_KEY': config.JWT_SECRET_KEY,
    'JWT_SESSION_COOKIE': False,
    'JWT_TOKEN_LOCATION': config.JWT_TOKEN_LOCATION,
    'JWT_COOKIE_SECURE': config.JWT_COOKIE_SECURE,
    'JWT_COOKIE_CSRF_PROTECT': True
}
application.config.update(config_params)

# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(doc_api, url_prefix='/api')
application.register_blueprint(media_api, url_prefix='/api/media')
application.register_blueprint(search_api, url_prefix='/api/search')
application.register_blueprint(google_auth_api, url_prefix='/auth')

jwt = JWTManager(application)
CORS(application, origins=['https://localhost', 'https://joyce-staging.net'])

if __name__ == "__main__":
	application.run(debug=False, threaded=True, host="0.0.0.0", port=443, ssl_context=('server.crt', 'server.key'))