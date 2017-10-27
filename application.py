from flask import Flask
from flask_bootstrap import Bootstrap

application = Flask(__name__)
application.config.from_object(__name__)

Bootstrap(application)

@application.route('/')
def show_landing():
	return render_template('index.html')

if __name__ == "__main__":
	application.run()