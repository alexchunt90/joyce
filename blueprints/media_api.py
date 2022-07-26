from flask import Blueprint, request, jsonify, flash, current_app
from werkzeug.utils import secure_filename
import os
import shutil
import es_func

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
@media_api.route('/', methods=['PUT'])
def create_media():
    if 'file' in request.files:
		file = request.files['file']
		es_func.index_and_save_media_file(file)
		return jsonify(es_func.es_document_list('media'))

# ''' Update media document '''
@media_api.route('/<string:id>', methods=['POST'])
def write_media(id):
    if request.data:
    	data = request.data
    	es_func.es_index_document('media', id, data)
    	return jsonify(es_func.es_document_list('media'))
    if 'file' in request.files:
		file = request.files['file']
		if file.filename != '' and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			data = media_data_from_file(filename)    	
			es_func.index_and_save_media_file(file, id)
			return jsonify(es_func.es_document_list('media'))

''' Delete media document '''
@media_api.route('/<string:id>', methods=['DELETE'])
def delete_media(id):
	document =  es_func.es_get_document('media', id)	
	shutil.rmtree(os.path.join(current_app.config['UPLOAD_FOLDER'], document['type'], id))
	es_func.es_delete_document('media', id)
	return jsonify(es_func.es_document_list('media'))