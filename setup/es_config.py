# Local

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
	},
}

CHAPTER_MAPPINGS = {
	'properties': {
		'number': {'type': 'integer'},
		'title': {'type': 'keyword'},
		'file_name': {'type': 'keyword'},			
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'created_at': {'type': 'date'},
	}
}

NOTE_MAPPINGS = {
	'properties': {
		'file_name': {'type': 'keyword'},
		'title': {'type': 'keyword'},
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'media_doc_ids': {'type': 'keyword'},
		'created_at': {'type': 'date'},
	}
}

INFO_MAPPINGS = {
	'properties': {
		'number': {'type': 'integer'},
		'file_name': {'type': 'keyword'},
		'title': {'type': 'keyword'},
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'media_doc_ids': {'type': 'keyword'},
		'created_at': {'type': 'date'},
	}
}

MEDIA_MAPPINGS = {
	'properties': {
		'title': {'type': 'keyword'},
		'src': {'type': 'keyword'},
		'file_name': {'type': 'keyword'},
		'thumb_file': {'type': 'keyword'},
		'file_ext': {'type': 'keyword'},
		'type': {'type': 'keyword'},
		'dimensions': {'type': 'integer'},
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'created_at': {'type': 'date'},
	}	    
}

TAG_MAPPINGS = {
	'properties': {
		'title': {'type': 'keyword'},
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'color': {'type': 'keyword'},
		'created_at': {'type': 'date'},
	}   
}

EDITION_MAPPINGS = {
	'properties': {
		'title': {'type': 'keyword'},
		'year': {'type': 'integer'},
		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
		'search_text': {'type': 'nested'},
		'created_at': {'type': 'date'},
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

INFO_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': INFO_MAPPINGS
}

MEDIA_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': MEDIA_MAPPINGS
}

TAG_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': TAG_MAPPINGS
}

EDITION_INDEX_SETTINGS = {
	'settings': DEFAULT_INDEX_SETTINGS,
	'mappings': EDITION_MAPPINGS
}