from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

reader = Blueprint('reader', __name__)

@reader.route('/')
def show_reader():
	return render_template('index.html')