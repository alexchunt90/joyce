from flask import Blueprint, render_template, abort, redirect
import json

import config

joyce = Blueprint('joyce', __name__)

manifest_path = config.MANIFEST_PATH
with joyce.open_resource(manifest_path, 'r') as stats_json:
    assets = json.load(stats_json)

@joyce.route('/', defaults={'path': ''})
@joyce.route('/<path:path>')
def show_joyce(path):
    return render_template('joyce.html', assets=assets)