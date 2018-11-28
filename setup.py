from elasticsearch import Elasticsearch, RequestsHttpConnection
from elasticsearch.helpers import bulk
import config

# Establish Elasticsearch Connection

if config.ENVIRONMENT == 'local':
	es = Elasticsearch(config.ELASTICSEARCH_LOCAL_HOST)

if config.ENVIRONMENT == 'staging':
	es = Elasticsearch(
	    hosts = config.ELASTICSEARCH_STAGING_HOST,
	    http_auth = config.AWS_AUTH,
	    use_ssl = True,
	    verify_certs = True,
	    connection_class = RequestsHttpConnection
	)

# Create Index Settings

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

# Read Seed Data from Files

def get_chapter_text_from_seed_data(string):
	string = string.encode('utf-8', 'ignore')
	fname = './seed_data/' + string + '.html'
	HtmlFile = open(fname, 'r')
	chapter_source = HtmlFile.read()
	HtmlFile.close()
	return chapter_source

def build_es_chapter_op(id, number, title, chap_file):
	return {'_op_type': 'index', '_id': id, '_source': {
			'number': number,
			'title': title,
			'html_source': get_chapter_text_from_seed_data(chap_file)
		}
	}

def build_es_note_op(id, title, text):
	return {'_op_type': 'index', '_id': id, '_source': {
			'title': title,
			'html_source': text,
		}
	}

SAMPLE_CHAPTERS = [
    build_es_chapter_op('AWNM3N3mxgFi4og697un', 1, 'Telemachus', 'telem'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vA', 2, 'Nestor', 'nestor'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vB', 3, 'Proteus', 'proteus'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vC', 4, 'Calyspo', 'calypso'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vD', 5, 'Lotus Eaters', 'lotus'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vE', 6, 'Hades', 'hades'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vF', 7, 'Aeolus', 'aeolus'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vG', 8, 'Lestrygonians', 'lestry'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vH', 9, 'Scylla and Charybdis', 'scylla'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vI', 10, 'Wandering Rocks', 'wrocks'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vJ', 11, 'Sirens', 'sirens'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vK', 12, 'Cyclops', 'cyclops'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vL', 13, 'Nausicaa', 'nausicaa'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vM', 14, 'Oxen of the Sun', 'oxen'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vN', 15, 'Circe', 'circe'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vO', 16, 'Eumaeus', 'eumaeus'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vP', 17, 'Ithaca', 'ithaca'),
    build_es_chapter_op('AWNmqpdHxgFi4og697vQ', 18, 'Penelope', 'penelope'),
]

SAMPLE_NOTES = [
	build_es_note_op('AWNmqpdHxgFi4og697vR', 'Kinch', 'A knife'),
	build_es_note_op('AWNmqpdHxgFi4og697vS', 'Lighthouse', 'A lighthouse'),
]

# Manipulate Indices

def delete_index(index):
	es.indices.delete(index=index, ignore=[400, 404])

def create_index(index, settings):
	es.indices.create(index=index, body=settings)

def index_seed_docs(index, docs):
	bulk(es, docs, index=index, doc_type='doc')

def refresh_all_indices():
	delete_index('chapters')
	delete_index('notes')
	delete_index('tags')
	print 'Elasticsearch index deleted!'
	create_index('chapters', chapter_index_settings)
	create_index('notes', note_index_settings)
	create_index('tags', tag_index_settings)
	print 'Elasticsearch index created!'

def refresh_seed_data():
	index_seed_docs('chapters', SAMPLE_CHAPTERS)
	index_seed_docs('notes', SAMPLE_NOTES)
	print 'Successfully loaded sample data!'

def es_setup():
	refresh_all_indices()
	refresh_seed_data()

if __name__ == "__main__":
	es_setup()

