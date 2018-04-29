from flask import Blueprint, render_template, abort, redirect
from jinja2 import TemplateNotFound

reader = Blueprint('reader', __name__)

@reader.route('/', defaults={'path': ''})
def redirect_root(path):
	return redirect('/1')
@reader.route('/<path:path>')
def show_reader(path):
    return render_template('reader.html')