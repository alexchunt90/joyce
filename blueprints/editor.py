from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

editor = Blueprint('editor', __name__)

@editor.route('/')
def show_reader():
	return render_template('editor.html')