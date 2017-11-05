from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)
# if es.ping() == True?

print 'API initialized!'

api = Blueprint('api', __name__)

# Get all chapters
@api.route('/chapters/')
def get_chapters():
	search = es.search(
		index='joyce', 
		doc_type='chapters', 
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
	res = es.get_source(index='joyce', doc_type='chapters', id=id, _source=True)
	return jsonify(res)

# Create and update chapters
@api.route('/chapters/<int:id>', methods=['POST', 'PUT'])
def write_chapter(id):
	if request.method == 'POST':
		if es.exists(index='joyce', doc_type='chapters', id=id):
			res = es.exists(index='joyce', doc_type='chapters', id=id)
		else:
			res = es.index(index='joyce', doc_type='chapters', id=id, body=request.data)
	else:
		if es.exists(index='joyce', doc_type='chapters', id=id):
			res = es.index(index='joyce', doc_type='chapters', id=id, body=request.data)
		else:
			res = 'That doesn\'t exist.'
	return jsonify(res)

# Delete chapter
@api.route('/chapters/<int:id>', methods=['DELETE'])
def delete_chapter(id):
	res = es.delete(index='joyce', doc_type='chapters', id=id)
	return jsonify(res)
