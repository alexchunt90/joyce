from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# Elasticsearch index setup

#Elasticsearch local connection
#TODO: Extract to config
ELASTICSEARCH_HOST = '127.0.0.1:9200'
es = Elasticsearch(ELASTICSEARCH_HOST)

print 'Elasticsearch index deleted!'

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
	    		'id': {'type': 'integer'},
	    		'name': {'type': 'keyword'},
	    		'text': {'type': 'text'}
	    	},
			# '_source': {
			# 	'excludes': [
			# 		'text'
			# 	]
			# }
	    }
	}
}

es.indices.create(index='joyce', body=create_index_settings)
print 'Elasticsearch index created!'

# Sample data
SAMPLE_DATA = [
    {'_op_type': 'create','_type': 'chapter', '_id': 1, '_source': {
			'id': 1,
			'name': 'Telemachus',
			'text': 'Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressinggown, ungirdled, was sustained gently behind him by the mild morning air. He held the bowl aloft and intoned:'
		},
    },	
    {'_op_type': 'create', '_type': 'chapter', '_id': 2, '_source': {
			'id': 2,
			'name': 'Nestor',			
			'text': 'Fabled by the daughters of memory. And yet it was in some way if not as memory fabled it. A phrase, then, of impatience, thud of Blake\'s wings of excess. I hear the ruin of all space, shattered glass and toppling masonry, and time one livid final flame. What\'s left us then?'
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 3, '_source': {
			'id': 3,
			'name': 'Proteus',
			'text': 'Ineluctable modality of the visible: at least that if no more, thought through my eyes. Signatures of all things I am here to read, seaspawn and seawrack, the nearing tide, that rusty boot. Snotgreen, bluesilver, rust: coloured signs. Limits of the diaphane. But he adds: in bodies. Then he was aware of them bodies before of them coloured. How? By knocking his sconce against them, sure. Go easy. Bald he was and a millionaire, maestro di color che sanno. Limit of the diaphane in. Why in? Diaphane, adiaphane. If you can put your five fingers through it it is a gate, if not a door. Shut your eyes and see.'
		},
    },
    {'_op_type': 'create', '_type': 'chapter', '_id': 4, '_source': {
			'id': 4,
			'name': 'Calyspo',
			'text': 'Mr Leopold Bloom ate with relish the inner organs of beasts and fowls. He liked thick giblet soup, nutty gizzards, a stuffed roast heart, liverslices fried with crustcrumbs, fried hencods\' roes. Most of all he liked grilled mutton kidneys which gave to his palate a fine tang of faintly scented urine.'
		},
    },   
    {'_op_type': 'create', '_type': 'chapter', '_id': 5, '_source': {
			'id': 5,
			'name': 'Lotus Eaters',
			'text': 'By lorries along sir John Rogerson\'s quay Mr Bloom walked soberly, past Windmill lane, Leask\'s the linseed crusher, the postal telegraph office. Could have given that address too. And past the sailors\' home. He turned from the morning noises of the quayside and walked through Lime street. By Brady\'s cottages a boy for the skins lolled, his bucket of offal linked, smoking a chewed fagbutt.',
		},
    }		
]

bulk(es, SAMPLE_DATA, index='joyce', doc_type='chapter')
print('Successfully loaded sample data!')

