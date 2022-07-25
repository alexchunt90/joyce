from flask import Blueprint, request, jsonify, flash, current_app
from werkzeug.utils import secure_filename
import os
import shutil
import es_func

media_api = Blueprint('media_api', __name__)


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mov', 'mp4', 'mp3', 'wav'}

def hello():
	print 'hello!'

def file_extension(filename):
	return filename.rsplit('.', 1)[1].lower()

def allowed_file(filename):
	return '.' in filename and \
		file_extension(filename) in ALLOWED_EXTENSIONS

def get_file_type(extension):
	image_ext = {'png', 'jpg', 'jpeg', 'gif'}
	mov_ext = {'mov', 'mp4'}
	audio_ext = {'mp3', 'wav'}
	if extension in image_ext:
		return 'img'
	if extension in mov_ext:
		return 'video'
	if extension in audio_ext:
		return 'audio'

def media_data_from_file(filename):
	data = {}
	file_ext = file_extension(filename)
	file_type = get_file_type(file_ext)	
	data['file_name'] = filename
	data['file_ext'] = file_ext
	data['type'] = file_type
	return data	

def index_and_save_media_file(file, id=None):
	if file.filename != '' and allowed_file(file.filename):
		filename = secure_filename(file.filename)
		data = media_data_from_file(filename)
		if id is None:
			response = es_func.es_create_document('media', data)
		if id:
			response = es_func.es_index_document('media', id, data)
		media_id = id if id is not None else response['_id']
		if id is None:
			os.mkdir(os.path.join(current_app.config['UPLOAD_FOLDER'], file_type, media_id))
		file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], file_type, media_id, 'img.' + file_ext))

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
		index_and_save_media_file(file)
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
			index_and_save_media_file(file, id)
			return jsonify(es_func.es_document_list('media'))

''' Delete media document '''
@media_api.route('/<string:id>', methods=['DELETE'])
def delete_media(id):
	document =  es_func.es_get_document('media', id)	
	shutil.rmtree(os.path.join(current_app.config['UPLOAD_FOLDER'], document['type'], id))
	es_func.es_delete_document('media', id)
	return jsonify(es_func.es_document_list('media'))