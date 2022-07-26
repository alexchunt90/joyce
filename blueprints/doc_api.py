from flask import Blueprint, render_template, abort, jsonify, request
from elasticsearch import Elasticsearch, RequestsHttpConnection
import sys
import config
import es_func

doc_api = Blueprint('api', __name__)

#
# Chapter API Routes
#

''' Get all chapters '''
@doc_api.route('/chapters/')
def get_chapter_list():
	return jsonify(es_func.es_document_list('chapters'))

''' Get specific chapter '''
@doc_api.route('/chapters/<string:id>')
def get_chapter_doc(id):
	data = es_func.es_get_document('chapters', id)
	return jsonify(data)

''' New chapter '''
@doc_api.route('/chapters/', methods=['PUT'])
def create_chapter():
	es_func.es_create_document('chapters', request.data)
	return jsonify(es_func.es_document_list('chapters'))

''' Write chapter '''
@doc_api.route('/chapters/<string:id>', methods=['POST'])
def write_chapter(id):
	data=json.loads(request.data)
	es_func.es_index_document('chapters', id, data)
	return jsonify(es_func.es_document_list('chapters'))

''' Delete chapter '''
@doc_api.route('/chapters/<string:id>', methods=['DELETE'])
def delete_chapter(id):
	es_func.es_delete_document('chapters', id)
	return jsonify(es_func.es_document_list('chapters'))

#
# Note API Routes
#

''' Get all notes '''
@doc_api.route('/notes/')
def get_note_list():
	return jsonify(es_func.es_document_list('notes'))

''' Get specific note '''
@doc_api.route('/notes/<string:id>')
def get_note_doc(id):
	data =  es_func.es_get_document('notes', id)
	return jsonify(data)

''' New note '''
@doc_api.route('/notes/', methods=['PUT'])
def create_note():
	es_func.es_create_document('notes', request.data)
	return jsonify(es_func.es_document_list('notes'))

''' Write note '''
@doc_api.route('/notes/<string:id>', methods=['POST'])
def write_note(id):
	es_func.es_index_document('notes', id, request.data)
	return jsonify(es_func.es_document_list('notes'))

''' Delete note '''
@doc_api.route('/notes/<string:id>', methods=['DELETE'])
def delete_note(id):
	es_func.es_delete_document('notes', id)
	return jsonify(es_func.es_document_list('notes'))

#
# Tag API Routes
#

''' Get all tags '''
@doc_api.route('/tags/')
def get_tag_list():
	return jsonify(es_func.es_document_list('tags'))

''' Get specific tag '''
@doc_api.route('/tags/<string:id>')
def get_tag_doc(id):
	data =  es_func.es_get_document('tags', id)
	return jsonify(data)

''' New tag '''
@doc_api.route('/tags/', methods=['PUT'])
def create_tag():
	es_func.es_create_document('tags', request.data)
	return jsonify(es_func.es_document_list('tags'))

''' Write tag '''
@doc_api.route('/tags/<string:id>', methods=['POST'])
def write_tag(id):
	es_func.es_index_document('tags', id, request.data)
	return jsonify(es_func.es_document_list('tags'))

''' Delete tag '''
@doc_api.route('/tags/<string:id>', methods=['DELETE'])
def delete_tag(id):
	es_func.es_delete_document('tags', id)
	return jsonify(es_func.es_document_list('tags'))

#
# Search API Routes
#

''' Basic Text Search '''
@doc_api.route('/search/', methods=['POST'])
def search_text():
	data = json.loads(request.data)
	results = es_func.es_search_text(data.get('data'))
	return jsonify(results)

#
# Dev Admin API Routes
#

#
# Refresh ES
# TODO: Restrict to dev only
@doc_api.route('/refresh/')
def refresh_es():
	setup.es_setup()
	return 'Success!'