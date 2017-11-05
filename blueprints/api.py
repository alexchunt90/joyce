from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

api = Blueprint('api', __name__)

doc_type = 'chapter'

# Get all chapters
@api.route('/chapters/')
def get_chapters():
	search = es.search(
		index='joyce', 
		doc_type=doc_type, 
		_source_exclude=['text'],
		body={
			'query': {'match_all': {}},
			'sort': [
				{'id': {'order': 'asc'}}
			]
		}
	)
	res = []
	for x in search['hits']['hits']:
		res.append(x['_source'])
	return jsonify(res)

# Get specific chapter
@api.route('/chapters/<int:id>')
def get_chapter(id):
	res = es.get_source(index='joyce', doc_type=doc_type, id=id)
	return jsonify(res)

# Create and update chapters
@api.route('/chapters/<int:id>', methods=['POST', 'PUT'])
def write_chapter(id):
	
	def es_index(data):
		return es.index(index='joyce', doc_type='chapter', id=id, body=data)

	if request.method == 'POST':
		if es.exists(index='joyce', doc_type=doc_type, id=id):
			res = 'That already exists.'
		else:
			res = es_index(request.data)
	else:
		if es.exists(index='joyce', doc_type=doc_type, id=id):
			res = es_index(request.data)
		else:
			res = 'That doesn\'t exist.'
	return jsonify(res)

# Delete chapter
@api.route('/chapters/<int:id>', methods=['DELETE'])
def delete_chapter(id):
	res = es.delete(index='joyce', doc_type=doc_type, id=id)
	return jsonify(res)
