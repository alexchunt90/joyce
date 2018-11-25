from elasticsearch import Elasticsearch, RequestsHttpConnection
from elasticsearch.helpers import bulk
import config

if config.ENV_VARIABLE == 'local':
	es = Elasticsearch(config.ELASTICSEARCH_LOCAL_HOST)

if config.ENV_VARIABLE == 'staging':
	es = Elasticsearch(
	    hosts = config.ELASTICSEARCH_STAGING_HOST,
	    http_auth = config.AWS_AUTH,
	    use_ssl = True,
	    verify_certs = True,
	    connection_class = RequestsHttpConnection
	)

def get_chapter_text_from_seed_data(string):
	string = string.encode('ascii', 'ignore')
	fname = './seed_data/' + string + '.html'
	HtmlFile = open(fname, 'r')
	chapter_source = HtmlFile.read()
	HtmlFile.close()
	return chapter_source

# DELETE INDEX: 
es.indices.delete(index='chapters', ignore=[400, 404])
es.indices.delete(index='notes', ignore=[400, 404])
es.indices.delete(index='tags', ignore=[400, 404])
print 'Elasticsearch index deleted!'

default_index_settings = {
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
}

chapter_mappings = {
    'doc': {
    	'properties': {
			'number': {'type': 'integer'},
			'title': {'type': 'keyword'},
			'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
			'search_text': {'type': 'nested'}
		}
	},    
}

note_mappings = {
    'doc': {
    	'properties': {
    		'title': {'type': 'keyword'},
    		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
    		'search_text': {'type': 'nested'}
    	}
    },   
}

tag_mappings = {
    'doc': {
    	'properties': {
    		'title': {'type': 'keyword'},
    		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
    		'search_text': {'type': 'nested'},
    		'color': {'type': 'keyword'}
    	}
    }	    
}

chapter_index_settings = {'settings': default_index_settings, 'mappings': chapter_mappings}
note_index_settings = {'settings': default_index_settings, 'mappings': note_mappings}
tag_index_settings = {'settings': default_index_settings, 'mappings': tag_mappings}

# TODO: Bulk create
es.indices.create(index='chapters', body=chapter_index_settings)
es.indices.create(index='notes', body=note_index_settings)
es.indices.create(index='tags', body=tag_index_settings)
print 'Elasticsearch index created!'

# Sample data
SAMPLE_CHAPTERS = [
    {'_op_type': 'index', '_id': 'AWNM3N3mxgFi4og697un', '_source': {
			'number': 1,
			'title': 'Telemachus',
			'html_source': get_chapter_text_from_seed_data('telem')
		},
    },	
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vA', '_source': {
			'number': 2,
			'title': 'Nestor',
			'html_source': get_chapter_text_from_seed_data('nestor')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vB', '_source': {
			'number': 3,
			'title': 'Proteus',
			'html_source': get_chapter_text_from_seed_data('proteus')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vC', '_source': {
			'number': 4,
			'title': 'Calyspo',
			'html_source': get_chapter_text_from_seed_data('calypso')
		},
    },   
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vD', '_source': {
			'number': 5,
			'title': 'Lotus Eaters',
			'html_source': get_chapter_text_from_seed_data('lotus')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vE', '_source': {
			'number': 6,
			'title': 'Hades',
			'html_source': get_chapter_text_from_seed_data('hades')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vF', '_source': {
			'number': 7,
			'title': 'Aeolus',
			'html_source': get_chapter_text_from_seed_data('aeolus')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vG', '_source': {
			'number': 8,
			'title': 'Lestrygonians',
			'html_source': get_chapter_text_from_seed_data('lestry')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vH', '_source': {
			'number': 9,
			'title': 'Scylla and Charybdis',
			'html_source': get_chapter_text_from_seed_data('scylla')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vI', '_source': {
			'number': 10,
			'title': 'Wandering Rocks',
			'html_source': get_chapter_text_from_seed_data('wrocks')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vJ', '_source': {
			'number': 11,
			'title': 'Sirens',
			'html_source': get_chapter_text_from_seed_data('sirens')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vK', '_source': {
			'number': 12,
			'title': 'Cyclops',
			'html_source': get_chapter_text_from_seed_data('cyclops')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vL', '_source': {
			'number': 13,
			'title': 'Nausicaa',
			'html_source': get_chapter_text_from_seed_data('nausicaa')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vM', '_source': {
			'number': 14,
			'title': 'Oxen of the Sun',
			'html_source': get_chapter_text_from_seed_data('oxen')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vN', '_source': {
			'number': 15,
			'title': 'Circe',
			'html_source': get_chapter_text_from_seed_data('circe')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vO', '_source': {
			'number': 16,
			'title': 'Eumaeus',
			'html_source': get_chapter_text_from_seed_data('eumaeus')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vP', '_source': {
			'number': 17,
			'title': 'Ithaca',
			'html_source': get_chapter_text_from_seed_data('ithaca')
		},
    },
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vQ', '_source': {
			'number': 18,
			'title': 'Penelope',
			'html_source': get_chapter_text_from_seed_data('penelope')
		},
    },
]

SAMPLE_NOTES = [
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vR', '_source': {
			'title': 'Kinch',
			'html_source': 'A knife'
		},
    }, 
    {'_op_type': 'index', '_id': 'AWNmqpdHxgFi4og697vS', '_source': {
			'title': 'Lighthouse',
			'html_source': 'A lighthouse'
		},
    },
]

bulk(es, SAMPLE_CHAPTERS, index='chapters', doc_type='doc')
bulk(es, SAMPLE_NOTES, index='notes', doc_type='doc')
print('Successfully loaded sample data!')

