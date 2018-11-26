from flask import Flask
from flask_webpack import Webpack
from werkzeug.serving import run_simple

from blueprints.joyce import joyce
from blueprints.api import api

# Initialize application
application = Flask(__name__)

WEBPACK_MANIFEST_PATH = './static/manifest.json'

params = {
    'ENV': 'staging',
    'DEBUG': True,
    'WEBPACK_MANIFEST_PATH': WEBPACK_MANIFEST_PATH
}


application.config.update(params)

webpack = Webpack()
webpack.init_app(application)

# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	application.run()
	 # run_simple('localhost', 5000, application, use_reloader=True, use_debugger=True)