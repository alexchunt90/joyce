from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# Elasticsearch index setup

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

# DELETE ES INDEX: 
es.indices.delete(index='joyce', ignore=[400, 404])

create_index_settings = {
	'settings' : {
		'index': {
	   		'number_of_shards' : 1, 
	    	'number_of_replicas' : 0 
		},
		'analysis': {
			'analyzer': {
				'html_analyzer': {
					'type': 'custom',
		        	'tokenizer': 'standard',
		        	'char_filter': ['html_strip']
				}
			}
		}
	},
	'mappings': {
	    'chapter': {
	    	'properties': {
	    		'number': {'type': 'integer'},
	    		'title': {'type': 'keyword'},
	    		'text': {
	    			'type': 'text',
	    		}
	    	}
	    },
	    'note': {
	    	'properties': {
	    		'title': {'type': 'keyword'},
	    		'text': {
	    			'type': 'text',
	    		}
	    	}
	    }
	}
}

es.indices.create(index='joyce', body=create_index_settings)
print 'Elasticsearch index created!'