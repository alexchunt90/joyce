from flask import Flask
from flask_webpack import Webpack
from werkzeug.serving import run_simple

from blueprints.reader import reader
from blueprints.api import api

# Initialize application
application = Flask(__name__)

params = {
    'DEBUG': True,
    'WEBPACK_MANIFEST_PATH': './static/js/manifest.json'
}

application.config.update(params)

webpack = Webpack()
webpack.init_app(application)

# Register blueprints
application.register_blueprint(reader)
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	# application.debug=True
	 run_simple('localhost', 5000, application, use_reloader=True, use_debugger=True)