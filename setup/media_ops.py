# import os
# import io
# import re
# import codecs

from blueprints.media_api import media_api

media_api.hello()

# from HTMLParser import HTMLParser
# from bs4 import BeautifulSoup as bs, Tag

# import es_helpers
# import es_config

# def import_note_operations(target_path):
# 	note_file_ops = []
# 	note_title_ops = []
# 	note_html_ops = []

# 	# Read in all notes and index their original file name
# 	notes_path = target_path + 'notes/'
# 	notes_file_list = os.listdir(notes_path)
# 	for i in notes_file_list:
# 		if i == '.DS_Store':
# 			continue
# 		op = es_helpers.build_es_create_op('file_name', i)
# 		note_file_ops.append(op)

# 	es_helpers.index_seed_docs('notes', note_file_ops)

# 	# Get those filenames back from Elasticsearch

# 	note_dict = es_helpers.es_document_dict('notes')

# 	# Iterate through the note HTML files
# 	for note in note_dict:
# 		note_path = notes_path + note
# 		note_id = note_dict[note]

# 		if note == '.DS_Store':
# 			continue

# 		html = open(note_path)
# 		soup = bs(html, 'html.parser')
# 		html.close()

# 		with codecs.open(note_path, 'w', encoding='utf-8') as file:
# 			file.write(unicode(final_text))

# 		# Build ES Op to Index Title
# 		note_title = soup.title.get_text()
# 		update_title_op = es_helpers.build_es_update_op(note_id, 'title', note_title)
# 		note_title_ops.append(update_title_op)

# 		# Build ES Op to Index HTML
# 		final_note_file = io.open(note_path, mode='r', encoding='utf-8')
# 		final_note_html = final_note_file.read()
# 		update_html_op = es_helpers.build_es_update_op(note_id, 'html_source', final_note_html)
# 		note_html_ops.append(update_html_op)
# 		final_note_file.close()

# 	print 'Note HTML successfully cleaned!'	

# 	# Index note contents to ES
# 	es_helpers.index_seed_docs('notes', note_title_ops)
# 	print 'Note titles successfully indexed!'
# 	es_helpers.index_seed_docs('notes', note_html_ops)
# 	print 'Note HTML successfully indexed!'