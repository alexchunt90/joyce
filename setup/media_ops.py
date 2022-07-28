import os
import io
import sys
from PIL import Image
from bs4 import BeautifulSoup as bs, Tag

import setup.es_helpers as es_helpers
import blueprints.es_func as es_func

UPLOAD_FOLDER = os.path.join(os.getenv('HOME'), 'Projects', 'joyce_flask', 'static')


def import_media_operations(target_path):
	images_path = target_path + 'img/'
	episoder_folder_list = os.listdir(images_path)
	for f in episoder_folder_list:
		if f == '.DS_Store':
			continue

		# Joyce source image documents are stored in notes/episode_N_images/images
		episode_folder = images_path + f
		img_folder = os.listdir(episode_folder + '/images')

		for img in img_folder:
			if es_func.allowed_file(img):
				data = es_func.media_data_from_file(img, f)

				file_path = os.path.join(images_path,data['file_name'])
				img_file = Image.open(file_path)
				response = es_func.es_create_document('media', data)
				save_folder = os.path.join(UPLOAD_FOLDER, data['type'], response['_id'])
				os.mkdir(save_folder)
				# Save files to ./static/img/[ _id ]/img.ext
				print('Importing image file:', img)
				# I have no idea why some JoyceProject jpeg images read as RGBA to Pillow, but this keeps them from erroring:
				if img_file.mode in ('RGBA', 'P') and data['file_ext'] in ('jpg', 'jpeg'):
					img_file = img_file.convert("RGB")
				img_file.save(os.path.join(save_folder, 'img.' + data['file_ext']))

	print('Image files successfully imported!')