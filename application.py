from flask import Flask
import json
import config
import setup

from blueprints.joyce import joyce
from blueprints.doc_api import doc_api
from blueprints.media_api import media_api

# Initialize application
application = Flask(__name__)

params = {
    'ENV': config.ENVIRONMENT,
    'DEBUG': True,
}

application.config.update(params)

# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(doc_api, url_prefix='/api')
application.register_blueprint(media_api, url_prefix='/static')

if __name__ == "__main__":
	application.run()