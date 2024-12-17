import os
import shutil

import setup.chap_ops as chap_ops
import setup.note_ops as note_ops
import setup.info_ops as info_ops
import setup.media_ops as media_ops
import setup.tag_ops as tag_ops
import setup.edition_ops as edition_ops
import setup.es_config as es_config
import setup.es_helpers as es_helpers
import setup.es_setup as es_setup

# Refresh Target Folder from Source Files
target_path = 'setup/target/'
chap_path = target_path + 'chap/'
note_path = target_path + 'notes/'
info_path = target_path + 'info/'
img_path = target_path + 'img/'
swap_path = target_path + 'swap/'

static_path = 'static/img'
src_path = 'setup/src/'

def clear_static_assets(static_path):
	if os.path.isdir(static_path):
		shutil.rmtree(static_path)
	os.mkdir(static_path)

def refresh_target_files(target_folder):
	target_folder_path = target_path + target_folder
	if os.path.isdir(target_folder_path):
		shutil.rmtree(target_folder_path)
	if os.path.isdir(src_path + target_folder):
		shutil.copytree(src_path + target_folder, target_folder_path)
	print('Target folder created:', target_folder_path)

def joyce_import():
	es_setup.refresh_indices()

	# # Import Joyce media files
	# refresh_target_files('img/')

	# Delete existing media assets
	# clear_static_assets(static_path)
	# media_ops.import_media_operations(img_path)

	# # Create Joyce info pages
	# refresh_target_files('info/')
	# info_ops.import_info_operations(info_path)

	# # Create Joyce editions
	# edition_ops.import_editions()

	# # Import Joyce tags
	# refresh_target_files('swap/')
	# tag_ops.import_tags()

	# # Import Joyce note files
	refresh_target_files('notes/')
	note_ops.import_note_operations(note_path)

	# # Import Joyce chapter files
	refresh_target_files('chap/')
	chap_ops.import_chap_operations(chap_path)

	# Run Node script to process HTML files using DraftJS and produce search_text for Elasticsearch	
	# os.system('npm run local_import info')
	# os.system('npm run import notes')
	# os.system('npm run import chapters')
	# print('HTML successufly optimized for DraftJS!')

if __name__ == '__main__':
	joyce_import()

# TODO:
# Error checking for failed links
# Remove cruft ES fields