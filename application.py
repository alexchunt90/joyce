from flask import Flask
from blueprints.reader import reader
from blueprints.api import api

# Initialize application
application = Flask(__name__)

# Register blueprints
application.register_blueprint(reader)
application.register_blueprint(api, url_prefix='/api')

if __name__ == "__main__":
	application.run()