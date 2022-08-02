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
    		'search_text': {'type': 'nested'},
    		'media_doc_ids': {'type': 'keyword'}
    	}
    }
}

MEDIA_MAPPINGS = {
    'doc': {
    	'properties': {
    		'title': {'type': 'keyword'},
    		'src': {'type': 'keyword'},
    		'file_name': {'type': 'keyword'},
    		'thumb_file': {'type': 'keyword'},
    		'file_ext': {'type': 'keyword'},
    		'type': {'type': 'keyword'},
    		'caption_html': {'type': 'text', 'analyzer': 'html_analyzer'},
    		'caption_search_text': {'type': 'text'}    		
    	}
    }	    
}

TAG_MAPPINGS = {
    'doc': {
    	'properties': {
    		'title': {'type': 'keyword'},
    		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
    		'search_text': {'type': 'nested'},
    		'color': {'type': 'keyword'}
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

MEDIA_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': MEDIA_MAPPINGS
}

TAG_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': TAG_MAPPINGS
}