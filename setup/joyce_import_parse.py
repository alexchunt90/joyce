import os
import shutil

import es_config
import clear_data
import chap_ops
import note_ops
# import media_ops

# Refresh Target Folder from Source Files
os.chdir(os.path.expanduser('~/Projects/joyce_flask/setup/'))
target_path = './target/'
src_path = './src/'
folders = ['chap', 'notes']

def refresh_target_files(target_path):
	if os.path.isdir(target_path):
		shutil.rmtree(target_path)
	os.mkdir(target_path)
	for folder in folders:
		shutil.copytree(src_path + folder, target_path + folder)
	print 'Target folder created!'

if __name__ == '__main__':
	refresh_target_files(target_path)
	clear_data.refresh_elasticsearch()
	# media_ops.import_media_operations(target_path)
	note_ops.import_note_operations(target_path)
	chap_ops.import_chap_operations(target_path)
	os.system('npm run import')
	print 'HTML successufly optimized for DraftJS!'	

# Index the result HTML to corresponding note
# Error checking for failed links