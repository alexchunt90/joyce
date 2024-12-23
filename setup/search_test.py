import blueprints.es_func as es_func
from elasticsearch import Elasticsearch

es = Elasticsearch('http://localhost:9200')

def es_search_text(search_input, doc_types, result_count):
	results = {}
	for doc_type in doc_types:
		doc_specific_results = search_index(search_input, doc_type, result_count)
		results[doc_type] = doc_specific_results
	return results

def search_index(search_input, doc_type, result_count):
	search = es.search(
		index=doc_type,
		body={
			'from': 0,
			'size': result_count,
			'query': {
				'nested': {
					'path': 'search_text',
					'query': {
						'bool': {
							'must': [
								{ 'match': { 'search_text.text': search_input}}
							]
						}
					},
					'inner_hits': { 
						'highlight': {
							'fields': {
								'search_text.text': {},						
							}
						}
					}
				}		
			},
		    'highlight' : {
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

	results = search['hits']['hits'] if search else []

	resultDocs = []
	for result in results:
		id = result['_id']
		title = result['_source']['title']
		number = result['_source']['number'] if doc_type == 'chapters' else None
		hits = result['inner_hits']['search_text']['hits']['hits']
		resultHits = []
		for hit in hits:
			highlight = hit['highlight']['search_text.text']
			key = hit['_source']['key']
			text = '...'.join(highlight)
			resultHits.append({'key': key, 'text': text})
		resultDocs.append({
			'id': id,
			'title': title,
			'number': number,
			'hits': resultHits	
		})
	return resultDocs

test_doc_types = ['chapters']
results = es_search_text('Buck Mulligan', test_doc_types, 10)
# print(results)