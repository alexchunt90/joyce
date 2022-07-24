from flask import Blueprint, render_template, abort, redirect
import os
import json
import config

media_api = Blueprint('media_api', __name__)

#
# Media API Routes
#

''' Get all media '''
@media_api.route('/media/')
def get_media_list():
	return jsonify(es_document_list('media'))

''' Get specific media '''
@media_api.route('/media/<string:id>')
def get_media_doc(id):
	data =  es_get_document('media', id)
	return jsonify(data)

''' New media '''
@media_api.route('/media/', methods=['PUT'])
def create_media():
	es_create_document('media', request.data)
	return jsonify(es_document_list('media'))

''' Write media '''
@media_api.route('/media/<string:id>', methods=['POST'])
def write_media(id):
	es_index_document('media', id, request.data)
	return jsonify(es_document_list('media'))

''' Delete media '''
@media_api.route('/media/<string:id>', methods=['DELETE'])
def delete_media(id):
	es_delete_document('media', id)
	return jsonify(es_document_list('media'))