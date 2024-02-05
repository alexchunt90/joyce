import setup.es_config as es_config
import setup.es_helpers as es_helpers

def refresh_elasticsearch(index, mapping):
	es_helpers.delete_index(index)
	es_helpers.create_index(index, mapping)
	print('Refreshed the following Elasticsearch index:', index)

def refresh_indices():
	refresh_elasticsearch('media', es_config.MEDIA_INDEX_SETTINGS)
	refresh_elasticsearch('editions', es_config.EDITION_INDEX_SETTINGS)
	refresh_elasticsearch('tags', es_config.TAG_INDEX_SETTINGS)
	refresh_elasticsearch('notes', es_config.NOTE_INDEX_SETTINGS)
	refresh_elasticsearch('chapters', es_config.CHAPTER_INDEX_SETTINGS)

if __name__ == '__main__':
	refresh_indices()