from flask import Flask

from blueprints.joyce import joyce
from blueprints.api import api

# Initialize application
application = Flask(__name__)

params = {
    'ENV': 'staging',
    'DEBUG': True,
}
application.config.update(params)

# Register blueprints
application.register_blueprint(joyce)
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	application.run()