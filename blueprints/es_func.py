from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from elasticsearch import Elasticsearch, RequestsHttpConnection
from PIL import Image
import os
import config

if config.ENVIRONMENT == 'local':
	es = Elasticsearch(config.ELASTICSEARCH_LOCAL_HOST)

if config.ENVIRONMENT == 'staging':
	es = Elasticsearch(
	    hosts = config.ELASTICSEARCH_STAGING_HOST,
	    http_auth = config.AWS_AUTH,
	    use_ssl = True,
	    verify_certs = True,
	    connection_class = RequestsHttpConnection
	)

# Return response object that combines ES ID and source fields
def merge_id_and_source(id, source):
	response = {'id': id}
	response.update(source)
	return response

# Iterate through ES results and construct response object
def merge_results(response):
	results = []
	for x in response:
		results.append(merge_id_and_source(x['_id'], x['_source']))
	return results

# Elasticsearch interface functions
def es_document_list(index):
	body = {
		'from': 0, 'size': 10000,
		'query': {'match_all': {}},
	}
	if index == 'chapters':
		body['sort'] = [
			{'number': {'order': 'asc'}}
		]	
	search = es.search(
		index=index,
		_source_exclude=['html_source', 'search_text', 'thumb_file', 'file_ext', 'file_name'],
		body=body
	)
	response = merge_results(search['hits']['hits'])
	return response

def es_get_document(index, id):
	res = es.get(
		index=index,
		doc_type='doc',
		id=id
	)
	data = merge_id_and_source(res['_id'], res['_source'])
	return data

def es_get_multiple_document(index, doc_ids):
	docs = es.mget(
		index=index,
		doc_type='doc',
		body={'ids': doc_ids}
	)
	response = merge_results(docs['docs'])
	return response

def es_index_document(index, id, body):
	res = es.index(
		index=index,
		doc_type='doc',
		id=id,
		refresh=True,
		body=body
	)
	return res

def es_create_document(index, body):
	res = es.index(
		index=index,
		doc_type='doc',
		refresh=True,
		body=body
	)
	return res

def es_update_document(index, id, data):
	res = es.update(
		index=index,
		doc_type='doc',
		id=id,
		refresh=True,
		body={'doc': data}
	)

def es_delete_document(index, id):
	res = es.delete(
		index=index,
		doc_type='doc',
		id=id,
		refresh=True
	)
	if index == 'chapters':
		return renumber_chapters()

def renumber_chapters():
	chapters = es_document_list('chapters')
	for index, chapter in enumerate(chapters):
		if index + 1 != chapter['number']:
			n = index + 1
			data = {'number': n}
			es_update_document('chapters', chapter['id'], data)
	return chapters

def group_search_results(es_results):
	types = set([])
	output_results = {}
	for result in es_results:
		types.add(result['_type'])
	for type in types:
		documents = []
		for result in es_results:
			if result['_type'] == type:
				hits = []
				for hit in result['inner_hits']['search_text']['hits']['hits']:
					hits.append(hit['_source'])
				entry = {
					'id': result['_id'],
					'title': result['_source']['title'],
					'hits': hits
				}
				if type == 'chapter':
					entry['number'] = result['_source']['number']
				documents.append(entry)
		output_results[type] = documents
	return output_results

def es_search_text(body):
	search = es.search(
		# index=doc_type,
		filter_path=[
			'hits.hits._id',
			'hits.hits._type',
			'hits.hits._source.title',
			'hits.hits._source.number',
			'hits.hits.title',
			'hits.hits.inner_hits.search_text.hits.hits._source'
		],
		body={
			'from': 0,
			'size': 10,
			'query': {
				'nested': {
					'path': 'search_text',
					'query': {
						'bool': {
							'must': [
								{ 'match': { 'search_text.text': body}}
							]
						}
					},
					'inner_hits': { 
						'highlight': {
							'fields': {
								'search_text.text': {}
							}
						}
					}
				}		
			},
		    'highlight' : {
		    	'number_of_fragments' : 15,
		        'fields' : {
		            'search_text': {
		            	'matched_fields': 'text',
		            	'type': 'unified',
		            	'pre_tags' : [''],
		            	'post_tags' : ['']
		            }
		        }
		    }			
		}
	)
	results = search['hits']['hits'] if search else {}
	grouped_results = group_search_results(results) 
	return grouped_results



# ______________
# 
# MEDIA HANDLING
# ______________

UPLOAD_FOLDER = os.path.join(os.getenv('HOME'), 'Projects', 'joyce_flask', 'static')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mov', 'mp4', 'mp3', 'wav'}

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

def media_data_from_file(filename, joyce_import_folder):
	image_file = filename if joyce_import_folder == '' else joyce_import_folder + '/images/' + filename
	thumb_file = filename if joyce_import_folder == '' else joyce_import_folder + '/thumbs/' + filename
	file_title = filename.split('.')[0]
	data = {}
	file_ext = file_extension(filename)
	file_type = get_file_type(file_ext)	
	data['file_name'] = image_file
	data['title'] = file_title
	data['thumb_file'] = thumb_file
	data['file_ext'] = file_ext
	data['type'] = file_type
	return data	

def index_and_save_media_file(file, id=None, form=None, import_folder=''):
	if file.filename != '' and allowed_file(file.filename):

		basename = os.path.basename(file.filename)
		filename = secure_filename(basename)
		metadata = media_data_from_file(filename, import_folder)
		metadata['dimensions'] = [file.width, file.height]

		if form:
			for k,v in form.items():
				metadata[k] = v

		if id is None:
			response = es_create_document('media', metadata)
		# If passed an id, function will update an existing document
		if id:
			response = es_index_document('media', id, metadata)
		media_id = id if id is not None else response['_id']
		if id is None:
			save_folder = os.path.join(UPLOAD_FOLDER, metadata['type'], media_id)
			os.mkdir(save_folder)
		file.save(os.path.join(UPLOAD_FOLDER, metadata['type'], media_id, 'img.' + metadata['file_ext']))


