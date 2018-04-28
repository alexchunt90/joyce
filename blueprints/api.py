from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch

# Elasticsearch local connection
# TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

api = Blueprint('api', __name__)

def merge_id_and_source(id, source):
	response = {'id': id}
	response.update(source)
	return response

# Elasticsearch interface functions
def es_document_list(doc_type):
	search = es.search(
		index='joyce', 
		doc_type=doc_type, 
		_source_exclude=['html_source', 'plain_text'],
		body={
			'from': 0, 'size': 10000,
			'query': {'match_all': {}},
			'sort': [
				{'number': {'order': 'asc'}}
			]
		}
	)
	res = []
	for x in search['hits']['hits']:
		res.append(merge_id_and_source(x['_id'], x['_source']))
	return res

def es_get_document(doc_type, id):
	res = es.get(
		index='joyce', 
		doc_type=doc_type, 
		id=id
	)
	data = merge_id_and_source(res['_id'], res['_source'])
	return data

def es_index_document(doc_type, id, body):
	res = es.index(
		index='joyce', 
		doc_type=doc_type,
		id=id,
		refresh=True,
		body=body
	)
	return res

def es_create_document(doc_type, body):
	res = es.index(
		index='joyce',
		doc_type=doc_type,
		refresh=True,
		body=body
	)
	return res

def es_update_number(id, number):
	res = es.update(
		index='joyce',
		doc_type='chapter',
		id=id,
		refresh=True,
		body={'doc': {'number': number}}
	)

def es_delete_document(doc_type, id):
	res = es.delete(
		index='joyce',
		doc_type=doc_type,
		id=id,
		refresh=True
	)
	if doc_type == 'chapter':
		return renumber_chapters()

def renumber_chapters():
	chapters = es_document_list('chapter')
	for index, chapter in enumerate(chapters):
		if index + 1 != chapter['number']:
			es_update_number(chapter['id'], index + 1)
	return chapters

def group_search_results(es_results):
	types = set([])
	output_results = {}
	for result in es_results:
		types.add(result['_type'])
	for type in types:
		list = []
		for result in es_results:
			entry = {'id': result['_id'], 'highlight': result['highlight']['plain_text']}
			list.append(entry)
		output_results[type] = list
	return output_results

def es_search_text(body):
	search = es.search(
		index='joyce',
		filter_path=['hits.hits._id', 'hits.hits._type', 'hits.hits.highlight', 'hits.hits.title'],
		body={
			'from': 0,
			'size': 10,
			'query': {
				'match': {
					'plain_text': {
						'query': body
					}
				}
			},
		    'highlight' : {
		        'fields' : {
					'_all' : { 'pre_tags' : [''], 'post_tags' : [''] },		        
		            'plain_text': {
		            	'matched_fields': 'text',
		            	'type': 'unified'
		            }
		        }
		    }			
		}
	)
	# TODO: Handle no hits
	results = search['hits']['hits']
	grouped_results = group_search_results(results)
	# return search
	return grouped_results


#
# Chapter API Routes
#

''' Get all chapters '''
@api.route('/chapters/')
def get_chapters():
	return jsonify(es_document_list('chapter'))

''' Get specific chapter '''
@api.route('/chapters/<string:id>')
def get_chapter(id):
	data = es_get_document('chapter', id)
	return jsonify(data)

''' New chapter '''
@api.route('/chapters/', methods=['PUT'])
def create_chapter():
	es_create_document('chapter', request.data)
	return jsonify(es_document_list('chapter'))

''' Write chapter '''
@api.route('/chapters/<string:id>', methods=['POST'])
def write_chapter(id):
	es_index_document('chapter', id, request.data)
	return jsonify(es_document_list('chapter'))

''' Delete chapter '''
@api.route('/chapters/<string:id>', methods=['DELETE'])
def delete_chapter(id):
	es_delete_document('chapter', id)
	return jsonify(es_document_list('chapter'))

#
# Note API Routes
#

''' Get all notes '''
@api.route('/notes/')
def get_notes():
	return jsonify(es_document_list('note'))

''' Get specific chapter '''
@api.route('/notes/<string:id>')
def get_note(id):
	data =  es_get_document('note', id)
	return jsonify(data)

''' New chapter '''
@api.route('/notes/', methods=['PUT'])
def create_note():
	es_create_document('note', request.data)
	return jsonify(es_document_list('note'))

''' Write chapter '''
@api.route('/notes/<string:id>', methods=['POST'])
def write_note(id):
	es_index_document('note', id, request.data)
	return jsonify(es_document_list('note'))

''' Delete chapter '''
@api.route('/notes/<string:id>', methods=['DELETE'])
def delete_note(id):
	es_delete_document('note', id)
	return jsonify(es_document_list('note'))

#
# Search API Routes
#

''' Basic Text Search '''
@api.route('/search/', methods=['POST'])
def search_text():
	return jsonify(es_search_text(request.data))
