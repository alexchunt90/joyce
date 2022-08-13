import os
import io
import sys
from PIL import Image
from bs4 import BeautifulSoup as bs, Tag

import setup.es_helpers as es_helpers
import blueprints.es_func as es_func

UPLOAD_FOLDER = os.path.join(os.getenv('HOME'), 'Projects', 'joyce_flask', 'static')


def import_media_operations(images_path):
	episoder_folder_list = os.listdir(images_path)
	for f in episoder_folder_list:
		if f == '.DS_Store':
			continue

		# Joyce source image documents are stored in notes/episode_N_images/images
		episode_folder = images_path + f
		img_folder = os.listdir(episode_folder + '/images')

		for img in img_folder:
			if es_func.allowed_file(img):
				print('Importing image file:', img)
				metadata = es_func.media_data_from_file(img, f)
				file_path = os.path.join(episode_folder, 'images' ,img)
				img_file = Image.open(file_path)
				# I have no idea why some JoyceProject jpeg images read as RGBA to Pillow, but this keeps them from erroring:
				if img_file.mode in ('RGBA', 'P') and metadata['file_ext'] in ('jpg', 'jpeg'):
					img_file = img_file.convert("RGB")
					img_file.save(file_path)
					img_file = Image.open(file_path)
				es_func.index_and_save_media_file(img_file, None, None, f)

	print('Image files successfully imported!')