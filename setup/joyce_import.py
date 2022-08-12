import os
import shutil

import setup.chap_ops as chap_ops
import setup.note_ops as note_ops
import setup.media_ops as media_ops
import setup.tag_ops as tag_ops
import setup.es_config as es_config
import setup.es_helpers as es_helpers

# Refresh Target Folder from Source Files
os.chdir(os.path.expanduser('~/Projects/joyce_flask/setup/'))
target_path = './target/'
chap_path = target_path + 'chap/'
note_path = target_path + 'notes/'
img_path = target_path + 'img/'
swap_path = target_path + 'swap/'

static_path = '../static/img'
src_path = './src/'

def clear_static_assets(static_path):
	shutil.rmtree(static_path)
	os.mkdir(static_path)

def refresh_target_files(target_folder):
	target_folder_path = target_path + target_folder
	if os.path.isdir(target_folder_path):
		shutil.rmtree(target_folder_path)
	shutil.copytree(src_path + target_folder, target_folder_path)
	print('Target folder created:', target_folder_path)

def refresh_elasticsearch(index, mapping):
	es_helpers.delete_index(index)
	es_helpers.create_index(index, mapping)
	print('Refreshed the following Elasticsearch index:', index)

if __name__ == '__main__':
	# Import Joyce media files
	refresh_target_files('img/')
	# Delete existing media assets
	clear_static_assets(static_path)
	refresh_elasticsearch('media', es_config.MEDIA_INDEX_SETTINGS) 
	media_ops.import_media_operations(img_path)

	# Import Joyce tags
	refresh_target_files('swap/')
	refresh_elasticsearch('tags', es_config.TAG_INDEX_SETTINGS)
	tag_ops.import_tags()

	# Import Joyce note files
	refresh_target_files('notes/')
	refresh_elasticsearch('notes', es_config.NOTE_INDEX_SETTINGS)
	note_ops.import_note_operations(note_path)

	# # Import Joyce chapter files
	refresh_target_files('chap/')
	refresh_elasticsearch('chapters', es_config.CHAPTER_INDEX_SETTINGS)
	chap_ops.import_chap_operations(chap_path)
	
	# # Run Node script to process HTML files using DraftJS and produce search_text for Elasticsearch	
	# os.system('npm run import')
	# print('HTML successufly optimized for DraftJS!')


# TODO:
# Error checking for failed links
# Tags