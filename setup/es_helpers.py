import os
import time
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

import config
import blueprints.es_func as es_func

es = Elasticsearch(config.ELASTICSEARCH_LOCAL_HOST)

def check_file_extension(filename):
	return filename.rsplit('.', 1)[1].lower()

def es_get_documents(index):
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
		_source_exclude=['html_source', 'search_text'],
		body=body
	)
	hits = search['hits']['hits']

	return hits

def es_document_dict(index):
	docs = es_get_documents(index)
	doc_dict = {}
	for i in docs:
		source = i['_source']
		if source['file_name']:
			file_name = source['file_name']
			doc_id = i['_id']
			doc_dict[file_name] = doc_id
	return doc_dict

def es_document_list(index):
	docs = es_func.es_get_documents(index, es)
	doc_list = []
	for i in docs:
		file_name = i['_source']['file_name']
		doc_list.append(file_name)
	return doc_list

def build_es_create_op(field, value):
	return {'_op_type': 'index', '_source': {
			field: value,
			'created_at': int(time.time())
		}
	}

def build_es_create_tag_op(title, html_source, color):
	return {'_op_type': 'index', '_source': {
			'title': title,
			'html_source': html_source,
			'color': color
		}
	}

def build_es_create_edition_op(title, year, html_source):
	return {'_op_type': 'index', '_source': {
			'title': title,
			'year': year,
			'html_source': html_source
		}
	}

def build_es_create_chap_op(title, number, file_name):
	return {'_op_type': 'index', '_source': {
			'title': title,
			'number': number,
			'file_name': file_name
		}
	}

def build_es_caption_op(dict):
	return {
		'_id': dict['id'],
		'_op_type': 'update',
		'_source': {
			'doc': {
				'html_source': dict['html_source'],
				'search_text': dict['search_text']
			}
		}
	}

def build_es_update_op(id, field, value):
	return {
		'_id': id,
		'_op_type': 'update',
		'_source': {
			'doc': {
				field: value
			}
		}
	}

def index_seed_docs(index, docs):
	bulk(es, docs, index=index, doc_type='doc', refresh='wait_for')	

def delete_index(index):
	es.indices.delete(index=index, ignore=[400, 404])

def create_index(index, settings):
	es.indices.create(index=index, body=settings)

def import_media_file(file, data):
	response = es_func.es_create_document('media', data, es)
	if id is None:
		os.mkdir(os.path.join(current_app.config['UPLOAD_FOLDER'], data['type'], response['_id']))
	# Save files to ./static/img/[ _id ]/img.ext
	file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], data['type'], response['_id'], 'img.' + data['file_ext']))	