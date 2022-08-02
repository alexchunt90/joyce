from flask import Flask
import os
import config

from blueprints.joyce import joyce
from blueprints.doc_api import doc_api
from blueprints.media_api import media_api

# Initialize application
application = Flask(__name__)

params = {
    'ENV': config.ENVIRONMENT,
    'DEBUG': True,
}

os.chdir(os.path.expanduser('~/Projects/joyce_flask/'))
UPLOAD_FOLDER = './static'
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
application.config['SECRET_KEY'] = config.SECRET_KEY
application.config.update(params)


# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(doc_api, url_prefix='/api')
application.register_blueprint(media_api, url_prefix='/api/media')

if __name__ == "__main__":
	application.run()