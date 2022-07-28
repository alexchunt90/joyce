import os
import shutil

import setup.clear_data as clear_data
import setup.chap_ops as chap_ops
import setup.note_ops as note_ops
import setup.media_ops as media_ops

# Refresh Target Folder from Source Files
os.chdir(os.path.expanduser('~/Projects/joyce_flask/setup/'))
target_path = './target/'
static_path = '../static/img'
src_path = './src/'
folders = ['chap', 'notes', 'img']

def refresh_target_files(target_path):
	if os.path.isdir(target_path):
		shutil.rmtree(target_path)
		shutil.rmtree(static_path)
	os.mkdir(target_path)
	os.mkdir(static_path)
	for folder in folders:
		shutil.copytree(src_path + folder, target_path + folder)
	print('Target folder created!')

if __name__ == '__main__':
	refresh_target_files(target_path)
	clear_data.refresh_elasticsearch()
	media_ops.import_media_operations(target_path)
	# note_ops.import_note_operations(target_path)
	# chap_ops.import_chap_operations(target_path)
	# os.system('npm run import')
	print('HTML successufly optimized for DraftJS!')

# Index the result HTML to corresponding note
# Error checking for failed links