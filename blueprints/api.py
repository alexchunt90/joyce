from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
import json
import boto3
import sys
import config

sys.path.insert(0,'..')

# TODO: Figure out which dependency tries to encode input to ascii
reload(sys)
sys.setdefaultencoding("utf-8")

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

api = Blueprint('api', __name__)

def merge_id_and_source(id, source):
	response = {'id': id}
	response.update(source)
	return response

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
		_source_exclude=['html_source', 'search_text'],
		body=body
	)
	res = []
	for x in search['hits']['hits']:
		res.append(merge_id_and_source(x['_id'], x['_source']))
	return res

def es_get_document(index, id):
	res = es.get(
		index=index,
		doc_type='doc',
		id=id
	)
	data = merge_id_and_source(res['_id'], res['_source'])
	return data

def es_index_document(index, id, body):
	print(index)
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

def es_update_number(id, number):
	res = es.update(
		index='chapters',
		doc_type='doc',
		id=id,
		refresh=True,
		body={'doc': {'number': number}}
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
			es_update_number(chapter['id'], index + 1)
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
				"nested": {
					"path": "search_text",
					"query": {
						"bool": {
							"must": [
								{ "match": { "search_text.text": body}}
							]
						}
					},
					"inner_hits": { 
						"highlight": {
							"fields": {
								"search_text.text": {}
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



#
# Chapter API Routes
#

''' Get all chapters '''
@api.route('/chapters/')
def get_chapters():
	return jsonify(es_document_list('chapters'))

''' Get specific chapter '''
@api.route('/chapters/<string:id>')
def get_chapter(id):
	data = es_get_document('chapters', id)
	return jsonify(data)

''' New chapter '''
@api.route('/chapters/', methods=['PUT'])
def create_chapter():
	es_create_document('chapters', request.data)
	return jsonify(es_document_list('chapters'))

''' Write chapter '''
@api.route('/chapters/<string:id>', methods=['POST'])
def write_chapter(id):
	data=json.loads(request.data)
	es_index_document('chapters', id, data)
	return jsonify(es_document_list('chapters'))

''' Delete chapter '''
@api.route('/chapters/<string:id>', methods=['DELETE'])
def delete_chapter(id):
	es_delete_document('chapters', id)
	return jsonify(es_document_list('chapters'))

#
# Note API Routes
#

''' Get all notes '''
@api.route('/notes/')
def get_notes():
	return jsonify(es_document_list('notes'))

''' Get specific chapter '''
@api.route('/notes/<string:id>')
def get_note(id):
	data =  es_get_document('notes', id)
	return jsonify(data)

''' New chapter '''
@api.route('/notes/', methods=['PUT'])
def create_note():
	es_create_document('notes', request.data)
	return jsonify(es_document_list('notes'))

''' Write chapter '''
@api.route('/notes/<string:id>', methods=['POST'])
def write_note(id):
	es_index_document('notes', id, request.data)
	return jsonify(es_document_list('notes'))

''' Delete chapter '''
@api.route('/notes/<string:id>', methods=['DELETE'])
def delete_note(id):
	es_delete_document('notes', id)
	return jsonify(es_document_list('notes'))

#
# Tag API Routes
#

''' Get all tags '''
@api.route('/tags/')
def get_tags():
	return jsonify(es_document_list('tags'))

''' Get specific chapter '''
@api.route('/tags/<string:id>')
def get_tag(id):
	data =  es_get_document('tags', id)
	return jsonify(data)

''' New chapter '''
@api.route('/tags/', methods=['PUT'])
def create_tag():
	es_create_document('tags', request.data)
	return jsonify(es_document_list('tags'))

''' Write chapter '''
@api.route('/tags/<string:id>', methods=['POST'])
def write_tag(id):
	es_index_document('tags', id, request.data)
	return jsonify(es_document_list('tags'))

''' Delete chapter '''
@api.route('/tags/<string:id>', methods=['DELETE'])
def delete_tag(id):
	es_delete_document('tags', id)
	return jsonify(es_document_list('tags'))

#
# Search API Routes
#

''' Basic Text Search '''
@api.route('/search/', methods=['POST'])
def search_text():
	data = json.loads(request.data)
	results = es_search_text(data.get('data'))
	return jsonify(results)
