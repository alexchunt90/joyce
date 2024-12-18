import setup.es_config as es_config
import setup.es_helpers as es_helpers

def refresh_elasticsearch(index, mapping):
	es_helpers.delete_index(index)
	es_helpers.create_index(index, mapping)
	print('Refreshed the following Elasticsearch index:', index)

config_mapping = {}
config_mapping['media'] = es_config.MEDIA_INDEX_SETTINGS
config_mapping['editions'] = es_config.EDITION_INDEX_SETTINGS
config_mapping['tags'] = es_config.TAG_INDEX_SETTINGS
config_mapping['notes'] = es_config.NOTE_INDEX_SETTINGS
config_mapping['info'] = es_config.INFO_INDEX_SETTINGS
config_mapping['chapters'] = es_config.CHAPTER_INDEX_SETTINGS


def refresh_indices(doc_type):
	refresh_elasticsearch(doc_type, config_mapping[doc_type])

if __name__ == '__main__':
	refresh_indices()