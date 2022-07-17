import os
import shutil

import es_config
import note_ops
import chap_ops

# Refresh Target Folder from Source Files
target_path = './target/'
src_path = './src/'
folders = ['chap', 'notes']
chap_path = target_path + 'chap/'
notes_path = target_path + 'notes/'

def refresh_target_files(target_path):
	if os.path.isdir(target_path):
		shutil.rmtree(target_path)
	os.mkdir(target_path)
	for folder in folders:
		shutil.copytree(src_path + folder, target_path + folder)
	print 'Target folder created!'

if __name__ == '__main__':
	refresh_target_files(target_path)
	# note_ops.import_note_operations(target_path)
	chap_ops.import_chap_operations(target_path)

# Index the result HTML to corresponding note
# Error checking for failed links