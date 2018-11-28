from flask import Flask
import json
import config
import setup

from blueprints.joyce import joyce
from blueprints.api import api

# Initialize application
application = Flask(__name__)

params = {
    'ENV': config.ENVIRONMENT,
    'DEBUG': True,
}

application.config.update(params)

# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	application.run()