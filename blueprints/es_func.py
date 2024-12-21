from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from elasticsearch import Elasticsearch
from PIL import Image
import os
import time
import json
import config

es = Elasticsearch(config.ELASTICSEARCH_DOCKER_HOST, timeout=199838918318, keep_alive=True)

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
def es_document_list(index, es_client=es):
	body = {
		'from': 0, 'size': 10000,
		'query': {
			'match_all': {},
		},
	}
	if index in ['chapters', 'info']:
		body['sort'] = [
			{'number': {'order': 'asc'}}
		]
	if index in ['notes']:
		body['sort'] = [
			{'title': {'order': 'asc'}}
		]
	search = es_client.search(
		index=index,
		_source_excludes=['html_source', 'search_text', 'thumb_file', 'file_name'],
		body=body,
	)
	response = merge_results(search['hits']['hits'])
	return response

def es_get_document(index, id, es_client=es):
	res = es_client.get(
		index=index,
		doc_type='_doc',
		id=id
	)
	data = merge_id_and_source(res['_id'], res['_source'])
	return data

def es_get_multiple_document(index, doc_ids):
	docs = es.mget(
		index=index,
		doc_type='_doc',
		body={'ids': doc_ids}
	)
	response = merge_results(docs['docs'])
	return response

def es_index_document(index, id, body):
	res = es.index(
		index=index,
		doc_type='_doc',
		id=id,
		refresh=True,
		body=body
	)
	return res


def es_create_document(index, body, es_client=es):
	data = json.loads(body.decode('utf-8')) 
	data['created_at'] = int(time.time())
	res = es_client.index(
		index=index,
		doc_type='_doc',
		refresh=True,
		body=data
	)
	return res

def es_update_document(index, id, data, es_client=es):
	res = es_client.update(
		index=index,
		doc_type='_doc',
		id=id,
		refresh=True,
		body={'doc': data}
	)

def es_update_search_text(id, data):
	res = es.update(
		index=data['doc_type'],
		doc_type='_doc',
		id=id,
		body={
			'doc': {
				'search_text': data['search_text'],
				'html_source': data['html_source']
			}
		}

	)
	return res

def es_delete_document(index, id):
	res = es.delete(
		index=index,
		doc_type='_doc',
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

def es_search_text(search_input, doc_types, result_count):
	results = {}
	for doc_type in doc_types:
		doc_specific_results = search_index(search_input, doc_type, result_count)
		results[doc_type] = doc_specific_results
	return results

def search_index(search_input, doc_type, result_count):
	search = es.search(
		index=doc_type,
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
			'size': result_count,
			'query': {
				'nested': {
					'path': 'search_text',
					'query': {
						'bool': {
							'must': [
								{ 'match': { 'search_text.text': search_input}}
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

	results = search['hits']['hits'] if search else []


	resultDocs = []
	for result in results:
		id = result['_id']
		title = result['_source']['title']
		number = result['_source']['number'] if doc_type == 'chapters' else None
		hits = result['inner_hits']['search_text']['hits']['hits']
		resultHits = []
		for hit in hits:
			key = hit['_source']['key']
			text = hit['_source']['text']
			resultHits.append({'key': key, 'text': text})
		resultDocs.append({
			'id': id,
			'title': title,
			'number': number,
			'hits': resultHits	
		})
	return resultDocs

# ______________
# 
# MEDIA HANDLING
# ______________

def file_extension(filename):
	return filename.rsplit('.', 1)[1].lower()

def allowed_file(filename):
	return '.' in filename and \
		file_extension(filename) in config.ALLOWED_EXTENSIONS

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

def index_and_save_media_file(file, id=None, form=None, import_folder='', es_client=es):
	if file.filename != '' and allowed_file(file.filename):
		basename = os.path.basename(file.filename)
		filename = secure_filename(basename)
		
		if isinstance(file, FileStorage):
			img_file = file = Image.open(file)
			file = img_file

		metadata = media_data_from_file(filename, import_folder)
		metadata['dimensions'] = [file.width, file.height]
		if form:
			for k,v in form.items():
				if k != 'search_text':
					metadata[k] = v
				else:
					metadata[k] = json.loads(v)
		if id is None:
			response = es_create_document('media', json.dumps(metadata).encode('utf-8'), es_client)
		# If passed an id, function will update an existing document
		if id:
			response = es_index_document('media', id, metadata, es_client)
		media_id = id if id is not None else response['_id']
		if id is None:
			save_folder = os.path.join(config.UPLOAD_FOLDER, metadata['type'], media_id)
			os.mkdir(save_folder)
		file.save(os.path.join(config.UPLOAD_FOLDER, metadata['type'], media_id, 'img.' + metadata['file_ext']))
		return response

def updating_existing_media_file(id, form_data):
	metadata = {}
	for k,v in form_data.items():
		if k != 'search_text':
			metadata[k] = v
		else:
			metadata[k] = json.loads(v)
	response = es_index_document('media', id, metadata)
	return response