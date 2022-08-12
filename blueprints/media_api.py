from flask import Blueprint, request, jsonify, flash, current_app
from werkzeug.utils import secure_filename
import os
import shutil
from . import es_func

media_api = Blueprint('media_api', __name__)

#
# Media API Routes
#

''' Get all ES media documents '''
@media_api.route('/')
def get_media_list():
	return jsonify(es_func.es_document_list('media'))

''' Get specific media document '''
@media_api.route('/<string:id>')
def get_media_doc(id):
	data =  es_func.es_get_document('media', id)
	return jsonify(data)

''' Index new media document '''
@media_api.route('/', methods=['POST'])
def create_media():
	if 'uploadFile' in request.files:
		file = request.files['uploadFile']
		form_data = request.form
		es_func.index_and_save_media_file(file, None, form_data)
		return get_media_list()
	else:
		return get_media_list()

''' Update media document '''
@media_api.route('/<string:id>', methods=['POST'])
def write_media(id):
	if request.data:
		data = request.data
		es_func.es_index_document('media', id, data)
		return jsonify(es_func.es_document_list('media'))
	if 'uploadFile' in request.files:
		file = request.files['uploadFile']
		form_data = request.form
		es_func.index_and_save_media_file(file, id, form_data)
		return jsonify(es_func.es_document_list('media'))

''' Delete media document '''
@media_api.route('/<string:id>', methods=['DELETE'])
def delete_media(id):
	document =  es_func.es_get_document('media', id)
	shutil.rmtree(os.path.join(current_app.config['UPLOAD_FOLDER'], document['type'], id))
	es_func.es_delete_document('media', id)
	return jsonify(es_func.es_document_list('media'))