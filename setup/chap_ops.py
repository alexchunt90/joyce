import os
import io
import re

from bs4 import BeautifulSoup as bs, Tag

import es_helpers
import es_config

# Seed with chapter data
chapter_list = []
def append_chapter(list, number, title, file_name):
	php_file = file_name + '.php'
	new_chap = {'number': number, 'title': title, 'file_name': php_file}
	list.append(new_chap)
	return list

append_chapter(chapter_list, 1, 'Telemachus', 'telem')
append_chapter(chapter_list, 2, 'Nestor', 'nestor')
append_chapter(chapter_list, 3, 'Proteus', 'proteus')
append_chapter(chapter_list, 4, 'Calyspo', 'calypso')
append_chapter(chapter_list, 5, 'Lotus Eaters', 'lotus')
append_chapter(chapter_list, 6, 'Hades', 'hades')
append_chapter(chapter_list, 7, 'Aeolus', 'aeolus')
append_chapter(chapter_list, 8, 'Lestrygonians', 'lestry')
append_chapter(chapter_list, 9, 'Scylla and Charybdis', 'scylla')
append_chapter(chapter_list, 10, 'Wandering Rocks', 'wrocks')
append_chapter(chapter_list, 11, 'Sirens', 'sirens')
append_chapter(chapter_list, 12, 'Cyclops', 'cyclops')
append_chapter(chapter_list, 13, 'Nausicaa', 'nausicaa')
append_chapter(chapter_list, 14, 'Oxen of the Sun', 'oxen')
append_chapter(chapter_list, 15, 'Circe', 'circe')
append_chapter(chapter_list, 16, 'Eumaeus', 'eumaeus')
append_chapter(chapter_list, 17, 'Ithaca', 'ithaca')
append_chapter(chapter_list, 18, 'Penelope', 'penelope')

# Main Chapter import path
def import_chap_operations(target_path):
	# Refresh ES index
	es_helpers.delete_index('chapters')
	es_helpers.create_index('chapters', es_config.CHAPTER_INDEX_SETTINGS)
	print('Chapter index refreshed in Elasticsearch!')

	chap_index_ops = []
	chap_html_ops = []

	# Create chapter documents in ES
	for l in chapter_list:
		index_op = es_helpers.build_es_create_chap_op(l['title'], l['number'], l['file_name'])
		chap_index_ops.append(index_op)
	es_helpers.index_seed_docs('chapters', chap_index_ops)

	chapters_path = target_path + 'chap/'
	chap_file_list = os.listdir(chapters_path)
	note_dict = es_helpers.es_document_dict('notes')
	chapter_dict = es_helpers.es_document_dict('chapters')	

	# Iterate through chap files
	for c in chapter_dict:
		if c == '.DS_Store':
			continue
		print 'Processing chapter file:', c

		chap_path = chapters_path + c
		chapter_id = chapter_dict[c]
		html = open(chap_path)
		soup = bs(html, 'html.parser')
		html.close()

		# Point hrefs to ES ids for notes
		for a in soup.findAll('a'):
			if a.has_attr('href'):
				href = a['href']

				if href.endswith('.htm') and href.startswith('notes/'):
					del a['class']
					del a['id']

					strip_href = href[len('notes/'):]
					if note_dict.has_key(strip_href):
						a['href'] = note_dict[strip_href]

		# Write resulting HTML to file
		with open(chap_path, 'w') as file:
			file.write(str(soup))

		# Build op to update ES doc with HTML
		final_chap_file = io.open(chap_path, mode='r', encoding='utf-8')
		final_chap_html = final_chap_file.read()
		update_html_op = es_helpers.build_es_update_op(chapter_id, 'html_source', final_chap_html)
		chap_html_ops.append(update_html_op)
		final_chap_file.close()			

	# Update ES document with HTML ops
	es_helpers.index_seed_docs('chapters', chap_html_ops)
	print 'Chapter HTML successfully indexed!'