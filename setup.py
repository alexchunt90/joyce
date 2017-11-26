from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# Elasticsearch index setup

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

print 'Elasticsearch index deleted!'

def get_chapter_text_from_seed_data(string):
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
	},
	'mappings': {
	    'chapter': {
	    	'properties': {
	    		'number': {'type': 'integer'},
	    		'title': {'type': 'keyword'},
	    		'text': {'type': 'text'}
	    	}
	    },
	    'note': {
	    	'properties': {
	    		'title': {'type': 'keyword'},
	    		'text': {'type': 'text'}
	    	}
	    }
	}
}

es.indices.create(index='joyce', body=create_index_settings)
print 'Elasticsearch index created!'

# Sample data
SAMPLE_DATA = [
    {'_op_type': 'create','_type': 'chapter', '_id': 1, '_source': {
			'number': 1,
			'title': 'Telemachus',
			'text': get_chapter_text_from_seed_data('telem')
		},
    },	
    {'_op_type': 'create', '_type': 'chapter', '_id': 2, '_source': {
			'number': 2,
			'title': 'Nestor',			
			'text': get_chapter_text_from_seed_data('nestor')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 3, '_source': {
			'number': 3,
			'title': 'Proteus',
			'text': get_chapter_text_from_seed_data('proteus')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 4, '_source': {
			'number': 4,
			'title': 'Calyspo',
			'text': get_chapter_text_from_seed_data('calypso')
		},
    },   
    {'_op_type': 'create', '_type': 'chapter', '_id': 5, '_source': {
			'number': 5,
			'title': 'Lotus Eaters',
			'text': get_chapter_text_from_seed_data('lotus')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 6, '_source': {
			'number': 6,
			'title': 'Hades',
			'text': get_chapter_text_from_seed_data('hades')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 7, '_source': {
			'number': 7,
			'title': 'Aeolus',
			'text': get_chapter_text_from_seed_data('aeolus')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 8, '_source': {
			'number': 8,
			'title': 'Lestrygonians',
			'text': get_chapter_text_from_seed_data('lestry')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 9, '_source': {
			'number': 9,
			'title': 'Scylla and Charybdis',
			'text': get_chapter_text_from_seed_data('scylla')
		},
    },
                {'_op_type': 'create', '_type': 'chapter', '_id': 10, '_source': {
			'number': 10,
			'title': 'Wandering Rocks',
			'text': get_chapter_text_from_seed_data('wrocks')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 11, '_source': {
			'number': 11,
			'title': 'Sirens',
			'text': get_chapter_text_from_seed_data('sirens')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 12, '_source': {
			'number': 12,
			'title': 'Cyclops',
			'text': get_chapter_text_from_seed_data('cyclops')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 13, '_source': {
			'number': 13,
			'title': 'Nausicaa',
			'text': get_chapter_text_from_seed_data('nausicaa')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 14, '_source': {
			'number': 14,
			'title': 'Oxen of the Sun',
			'text': get_chapter_text_from_seed_data('oxen')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 15, '_source': {
			'number': 15,
			'title': 'Circe',
			'text': get_chapter_text_from_seed_data('circe')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 16, '_source': {
			'number': 16,
			'title': 'Eumaeus',
			'text': get_chapter_text_from_seed_data('eumaeus')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 17, '_source': {
			'number': 17,
			'title': 'Ithaca',
			'text': get_chapter_text_from_seed_data('ithaca')
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 18, '_source': {
			'number': 18,
			'title': 'Penelope',
			'text': get_chapter_text_from_seed_data('penelope')
		},
    },
    {'_op_type': 'create', '_type': 'note', '_id': 1, '_source': {
			'title': 'Kinch',
			'text': 'A knife'
		},
    }, 
    {'_op_type': 'create', '_type': 'note', '_id': 2, '_source': {
			'title': 'Lighthouse',
			'text': 'A lighthouse'
		},
    },                                  
]

bulk(es, SAMPLE_DATA, index='joyce', doc_type='chapter')
print('Successfully loaded sample data!')

