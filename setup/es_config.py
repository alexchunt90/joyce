# Local
ELASTICSEARCH_LOCAL_HOST = '127.0.0.1:9200'

DEFAULT_INDEX_SETTINGS = {
	'index': {
   		'number_of_shards' : 1, 
    	'number_of_replicas' : 0 
	},
	'analysis': {
		'analyzer': {
			'html_analyzer': {
				'type': 'custom',
	        	'tokenizer': 'standard',
	        	'char_filter': ['custom_tags']
			}
		},
		'char_filter': {
			'custom_tags': {
				'type': 'html_strip',
				'escaped_tags': [
					'a'
				]
			}
		}
	}
}

CHAPTER_MAPPINGS = {
    'doc': {
    	'properties': {
			'number': {'type': 'integer'},
			'title': {'type': 'keyword'},
    		'file_name': {'type': 'keyword'},			
			'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
			'search_text': {'type': 'nested'}
		}
	},    
}

NOTE_MAPPINGS = {
    'doc': {
    	'properties': {
    		'file_name': {'type': 'keyword'},
    		'title': {'type': 'keyword'},
    		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
    		'search_text': {'type': 'nested'}    		
    	}
    }
}

CHAPTER_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': CHAPTER_MAPPINGS
}

NOTE_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': NOTE_MAPPINGS
}