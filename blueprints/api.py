from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

api = Blueprint('api', __name__)

doc_type = 'chapter'

def es_chapter_search():
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

# Get all chapters
@api.route('/chapters/')
def get_chapters():
	return es_chapter_search()

# Get specific chapter
@api.route('/chapters/<int:id>')
def get_chapter(id):
	res = es.get_source(index='joyce', doc_type='chapter', id=id)
	return jsonify(res)

# Create and update chapters
@api.route('/chapters/<int:id>', methods=['POST'])
def write_chapter(id):
	es.index(index='joyce', doc_type='chapter', id=id, refresh=True, body=request.data)
	return es_chapter_search()

# Delete chapter
@api.route('/chapters/<int:id>', methods=['DELETE'])
def delete_chapter(id):
	es.delete(index='joyce', doc_type=doc_type, id=id, refresh=True)
	return es_chapter_search()
