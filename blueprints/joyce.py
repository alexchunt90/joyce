from flask import Blueprint, render_template, make_response
import os
import json
import config

joyce = Blueprint('joyce', __name__)

manifest_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir, config.MANIFEST_PATH))

@joyce.route('/', defaults={'path': ''})
@joyce.route('/<path:path>')
def show_joyce(path):
	with joyce.open_resource(manifest_path, 'r') as assets_json:
		assets = json.load(assets_json)
	template = render_template('joyce.html', assets=assets)
	# response = make_response(template)
	# response.headers.add('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
	return template