from flask import Blueprint, render_template, abort, jsonify, request
from flask_jwt_extended import jwt_required
import sys
import config
import json
from . import es_func

search_api = Blueprint('search_api', __name__)

#
# Search API Routes
#

''' Basic Text Search '''
@search_api.route('/', methods=['POST'])
def search_text():
	data = json.loads(request.data)['data']
	search_input = data['searchInput']
	doc_types = []
	for doc_type, value in data['docTypes'].items():
		if value:
			doc_types.append(doc_type)
	result_count = data['resultCount']
	results = es_func.es_search_text(search_input, doc_types, result_count)
	return jsonify(results)