from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# Elasticsearch index setup

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

print 'Elasticsearch index deleted!'

def get_chapter_text_from_seed_data(string):
	string = string.encode('ascii', 'ignore')
	fname = './seed_data/' + string + '.html'
	HtmlFile = open(fname, 'r')
	chapter_source = HtmlFile.read()
	HtmlFile.close()
	return chapter_source

# DELETE INDEX: 
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
    			'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
    			'plain_text': {'type': 'text'}
    		}
    	},
	    'note': {
	    	'properties': {
	    		'title': {'type': 'keyword'},
	    		'html_source': {'type': 'text', 'analyzer': 'html_analyzer'},
	    		'plain_text': {'type': 'text'}
	    	}
	    }
	}
}

es.indices.create(index='joyce', body=create_index_settings)
print 'Elasticsearch index created!'

# Sample data
SAMPLE_DATA = [
    {'_op_type': 'index','_type': 'chapter', '_source': {
			'number': 1,
			'title': 'Telemachus',
			'html_source': get_chapter_text_from_seed_data('telem')
		},
    },	
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 2,
			'title': 'Nestor',
			'html_source': get_chapter_text_from_seed_data('nestor')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 3,
			'title': 'Proteus',
			'html_source': get_chapter_text_from_seed_data('proteus')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 4,
			'title': 'Calyspo',
			'html_source': get_chapter_text_from_seed_data('calypso')
		},
    },   
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 5,
			'title': 'Lotus Eaters',
			'html_source': get_chapter_text_from_seed_data('lotus')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 6,
			'title': 'Hades',
			'html_source': get_chapter_text_from_seed_data('hades')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 7,
			'title': 'Aeolus',
			'html_source': get_chapter_text_from_seed_data('aeolus')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 8,
			'title': 'Lestrygonians',
			'html_source': get_chapter_text_from_seed_data('lestry')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 9,
			'title': 'Scylla and Charybdis',
			'html_source': get_chapter_text_from_seed_data('scylla')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 10,
			'title': 'Wandering Rocks',
			'html_source': get_chapter_text_from_seed_data('wrocks')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 11,
			'title': 'Sirens',
			'html_source': get_chapter_text_from_seed_data('sirens')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 12,
			'title': 'Cyclops',
			'html_source': get_chapter_text_from_seed_data('cyclops')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 13,
			'title': 'Nausicaa',
			'html_source': get_chapter_text_from_seed_data('nausicaa')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 14,
			'title': 'Oxen of the Sun',
			'html_source': get_chapter_text_from_seed_data('oxen')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 15,
			'title': 'Circe',
			'html_source': get_chapter_text_from_seed_data('circe')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 16,
			'title': 'Eumaeus',
			'html_source': get_chapter_text_from_seed_data('eumaeus')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 17,
			'title': 'Ithaca',
			'html_source': get_chapter_text_from_seed_data('ithaca')
		},
    },
    {'_op_type': 'index', '_type': 'chapter', '_source': {
			'number': 18,
			'title': 'Penelope',
			'html_source': get_chapter_text_from_seed_data('penelope')
		},
    },
    {'_op_type': 'index', '_type': 'note', '_source': {
			'title': 'Kinch',
			'html_source': 'A knife'
		},
    }, 
    {'_op_type': 'index', '_type': 'note', '_source': {
			'title': 'Lighthouse',
			'html_source': 'A lighthouse'
		},
    },
]

bulk(es, SAMPLE_DATA, index='joyce', doc_type='chapter')
print('Successfully loaded sample data!')

