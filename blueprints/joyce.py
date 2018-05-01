from flask import Blueprint, render_template, abort, redirect
from jinja2 import TemplateNotFound

joyce = Blueprint('joyce', __name__)

@joyce.route('/', defaults={'path': ''})
def redirect_root(path):
	return redirect('/1')
@joyce.route('/<path:path>')
def show_joyce(path):
    return render_template('joyce.html')