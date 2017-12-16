from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

notes = Blueprint('notes', __name__)

@notes.route('/')
def show_reader():
	return render_template('notes.html')