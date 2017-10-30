from flask import Blueprint, render_template, abort, jsonify, request
from jinja2 import TemplateNotFound
from elasticsearch import Elasticsearch

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

api = Blueprint('api', __name__)

# Get all chapters
@api.route('/chapters')
def get_chapters():
	res = es.search(index='joyce', doc_type='chapters', body={'query': {'match_all': {}}})
	# chapters = { your_key: old_dict[your_key] for your_key in your_keys }
	return jsonify(res)

# Get singular chapter
@api.route('/chapters/<int:id>')
def get_chapter(id):
	res = es.get(index='joyce', doc_type='chapters', id=id, _source=True)
	return jsonify(res['_source'])

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
