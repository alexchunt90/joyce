from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch

# Elasticsearch local connection
# TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

api = Blueprint('api', __name__)

# Elasticsearch interface functions
def es_document_list(doc_type):
	search = es.search(
		index='joyce', 
		doc_type=doc_type, 
		_source_exclude=['text'],
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
		res.append(x['_source'])
	return jsonify(res)

def es_get_document(doc_type, id):
	res = es.get_source(
		index='joyce', 
		doc_type=doc_type, 
		id=id
	)
	return jsonify(res)

def es_write_document(doc_type, id, body):
	res = es.index(
		index='joyce', 
		doc_type=doc_type,
		id=id,
		refresh=True,
		body=body
	)
	return jsonify(res)

def es_delete_document(doc_type, id):
	res = es.delete(
		index='joyce',
		doc_type=doc_type,
		id=id,
		refresh=True
	)
	return jsonify(res)
#
# Chapter API Routes
#

""" Get all chapters """
@api.route('/chapters/')
def get_chapters():
	return es_document_list('chapter')

""" Get specific chapter """
@api.route('/chapters/<int:id>')
def get_chapter(id):
	return es_get_document('chapter', id)

""" Write chapter """
@api.route('/chapters/<int:id>', methods=['POST'])
def write_chapter(id):
	es_write_document('chapter', id, request.data)
	return es_document_list('chapter')

""" Delete chapter """
@api.route('/chapters/<int:id>', methods=['DELETE'])
def delete_chapter(id):
	es_delete_document('chapter', id)
	return es_document_list('chapter')

#
# Note API Routes
#

""" Get all notes """
@api.route('/notes/')
def get_notes():
	return es_document_list('note')

""" Get specific chapter """
@api.route('/notes/<int:id>')
def get_note(id):
	return es_get_document('note', id)

""" Write chapter """
@api.route('/notes/<int:id>', methods=['POST'])
def write_note(id):
	es_write_document('note', id, request.data)
	return es_document_list('note')

""" Delete chapter """
@api.route('/notes/<int:id>', methods=['DELETE'])
def delete_note(id):
	es_delete_document('note', id)
	return es_document_list('note')

