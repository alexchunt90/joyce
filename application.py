from flask import Flask
from flask_webpack import Webpack
from werkzeug.serving import run_simple

from blueprints.reader import reader
from blueprints.editor import editor
from blueprints.api import api

# Initialize application
application = Flask(__name__)

WEBPACK_MANIFEST_PATH = './static/manifest.json'

params = {
    'DEBUG': True,
    'WEBPACK_MANIFEST_PATH': WEBPACK_MANIFEST_PATH
}


application.config.update(params)

webpack = Webpack()
webpack.init_app(application)

# Register blueprints
application.register_blueprint(reader)
application.register_blueprint(editor, url_prefix='/editor')
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	# application.debug=True
	 run_simple('localhost', 5000, application, use_reloader=True, use_debugger=True)