from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

text = Blueprint('text', __name__)

@text.route('/')
def show_reader():
	return render_template('text.html')