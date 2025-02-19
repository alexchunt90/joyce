import setup.es_helpers as es_helpers


def clear_indices():
	es_helpers.delete_index('media')
	es_helpers.delete_index('editions')
	es_helpers.delete_index('tags')
	es_helpers.delete_index('notes')
	es_helpers.delete_index('info')
	es_helpers.delete_index('chapters')

if __name__ == '__main__':
	clear_indices()