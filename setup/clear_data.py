import es_helpers
import es_config

def import_note_operations():
	# Chapters
	es_helpers.delete_index('chapters')
	es_helpers.create_index('chapters', es_config.CHAPTER_INDEX_SETTINGS)
	print('Chapter index refreshed in Elasticsearch!')
	# Notes
	es_helpers.delete_index('notes')
	es_helpers.create_index('notes', es_config.NOTE_INDEX_SETTINGS)
	print('Note index refreshed in Elasticsearch!')
	# Media
	es_helpers.delete_index('media')
	es_helpers.create_index('media', es_config.MEDIA_INDEX_SETTINGS)
	print('Media index refreshed in Elasticsearch!')
	# Tags
	es_helpers.delete_index('tags')
	es_helpers.create_index('tags', es_config.TAG_INDEX_SETTINGS)
	print('Tag index refreshed in Elasticsearch!')		


if __name__ == "__main__":
	import_note_operations()	