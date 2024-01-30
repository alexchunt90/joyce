from flask import Blueprint, render_template, abort, jsonify, request
from flask_jwt_extended import jwt_required
import sys
import config
import json
from . import es_func
from setup.joyce_import import joyce_import

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
@jwt_required()
def create_chapter():
	es_func.es_create_document('chapters', request.data)
	return jsonify(es_func.es_document_list('chapters'))

''' Write chapter '''
@doc_api.route('/chapters/<string:id>', methods=['POST'])
@jwt_required()
def write_chapter(id):
	data=json.loads(request.data)
	es_func.es_index_document('chapters', id, data)
	return jsonify(es_func.es_document_list('chapters'))

''' Delete chapter '''
@doc_api.route('/chapters/<string:id>', methods=['DELETE'])
@jwt_required()
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
@jwt_required()
def create_note():
	es_func.es_create_document('notes', request.data)
	return jsonify(es_func.es_document_list('notes'))

''' Write note '''
@doc_api.route('/notes/<string:id>', methods=['POST'])
@jwt_required()
def write_note(id):
	es_func.es_index_document('notes', id, request.data)
	return jsonify(es_func.es_document_list('notes'))

''' Delete note '''
@doc_api.route('/notes/<string:id>', methods=['DELETE'])
@jwt_required()
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
@jwt_required()
def create_tag():
	es_func.es_create_document('tags', request.data)
	return jsonify(es_func.es_document_list('tags'))

''' Write tag '''
@doc_api.route('/tags/<string:id>', methods=['POST'])
@jwt_required()
def write_tag(id):
	es_func.es_index_document('tags', id, request.data)
	return jsonify(es_func.es_document_list('tags'))

''' Delete tag '''
@doc_api.route('/tags/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_tag(id):
	es_func.es_delete_document('tags', id)
	return jsonify(es_func.es_document_list('tags'))


#
# Edition API Routes
#

''' Get all editions '''
@doc_api.route('/editions/')
def get_edition_list():
	return jsonify(es_func.es_document_list('editions'))

''' Get specific edition '''
@doc_api.route('/editions/<string:id>')
def get_edition_doc(id):
	data =  es_func.es_get_document('editions', id)
	return jsonify(data)

''' New edition '''
@doc_api.route('/editions/', methods=['PUT'])
@jwt_required()
def create_edition():
	es_func.es_create_document('editions', request.data)
	return jsonify(es_func.es_document_list('editions'))

''' Write edition '''
@doc_api.route('/editions/<string:id>', methods=['POST'])
@jwt_required()
def write_edition(id):
	es_func.es_index_document('editions', id, request.data)
	return jsonify(es_func.es_document_list('editions'))

''' Delete edition '''
@doc_api.route('/editions/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_edition(id):
	es_func.es_delete_document('editions', id)
	return jsonify(es_func.es_document_list('edtions'))	

#
# Dev Admin API Routes
#

#
# Refresh ES
# TODO: Restrict to dev only
@doc_api.route('/refresh/')
@jwt_required()
def refresh_es():
	joyce_import()
	return 'Success!'