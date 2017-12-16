from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

search = Blueprint('search', __name__)

@search.route('/')
def show_search():
	return render_template('search.html')