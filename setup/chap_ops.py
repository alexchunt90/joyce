import os
import io
import re
import codecs
from bs4 import BeautifulSoup as bs, Tag

import blueprints.es_func as es_func
from . import es_helpers
from . import es_config
from . import tag_ops

# Seed with chapter data
chapter_list = []
def append_chapter(list, number, title, file_name):
	php_file = file_name + '.php'
	new_chap = {'number': number, 'title': title, 'file_name': php_file}
	list.append(new_chap)
	return list

append_chapter(chapter_list, 1, 'Telemachus', 'telem')
# append_chapter(chapter_list, 2, 'Nestor', 'nestor')
# append_chapter(chapter_list, 3, 'Proteus', 'proteus')
# append_chapter(chapter_list, 4, 'Calyspo', 'calypso')
# append_chapter(chapter_list, 5, 'Lotus Eaters', 'lotus')
# append_chapter(chapter_list, 6, 'Hades', 'hades')
# append_chapter(chapter_list, 7, 'Aeolus', 'aeolus')
# append_chapter(chapter_list, 8, 'Lestrygonians', 'lestry')
# append_chapter(chapter_list, 9, 'Scylla and Charybdis', 'scylla')
# append_chapter(chapter_list, 10, 'Wandering Rocks', 'wrocks')
# append_chapter(chapter_list, 11, 'Sirens', 'sirens')
# append_chapter(chapter_list, 12, 'Cyclops', 'cyclops')
# append_chapter(chapter_list, 13, 'Nausicaa', 'nausicaa')
# append_chapter(chapter_list, 14, 'Oxen of the Sun', 'oxen')
# append_chapter(chapter_list, 15, 'Circe', 'circe')
# append_chapter(chapter_list, 16, 'Eumaeus', 'eumaeus')
# append_chapter(chapter_list, 17, 'Ithaca', 'ithaca')
# append_chapter(chapter_list, 18, 'Penelope', 'penelope')

# Main Chapter import path
def import_chap_operations(chapters_path):
	chap_index_ops = []
	chap_html_ops = []

	# Create chapter documents in ES
	for l in chapter_list:
		index_op = es_helpers.build_es_create_chap_op(l['title'], l['number'], l['file_name'])
		chap_index_ops.append(index_op)
	es_helpers.index_seed_docs('chapters', chap_index_ops)

	chap_file_list = os.listdir(chapters_path)
	note_dict = es_helpers.es_document_dict('notes')
	chapter_dict = es_helpers.es_document_dict('chapters')

	# Parse Swap JS files to find the hex colors for each chapter's links
	swap_path = 'setup/target/swap/'
	annotation_dict = tag_ops.parse_chapter_annotations(swap_path)

	# Iterate through chap files
	for c in chapter_dict:
		if es_func.file_extension(c) != 'php':
			continue
		print('Generating chapter file:', c)

		chap_path = chapters_path + c
		chapter_id = chapter_dict[c]
		html = open(chap_path)
		soup = bs(html, 'html.parser', preserve_whitespace_tags=['a', 'p'])
		html.close()

		chap_name = c.split('.')[0]
		chap_annotations = annotation_dict[chap_name]

		# Reformat page break span tags into expected format
		for s in soup.findAll('span'):
			if s.has_attr('data-edition'):
				edition_string = s['data-edition']
				page_string = s['data-page']
				edition_int = re.sub('ed', '', edition_string)

				del s['class']
				s['data-edition'] = edition_int
				span_text = '{}#{}'.format(edition_int, page_string)
				s.string = span_text

		# Point hrefs to ES ids for notes
		for a in soup.findAll('a'):
			if a.has_attr('href'):
				href = a['href']
				strip_href = href[len('notes/'):]
				if chap_annotations.__contains__(a['id']):
					hex_color = chap_annotations[a['id']]
				else:
					print('Found a chapter link with elementId that isn\'t referenced in the swap files:', a['id'])
				if href.endswith('.htm') and href.startswith('notes/'):
					del a['class']
					del a['id']
					if note_dict.__contains__(strip_href):
						if hex_color:
							a['data-color'] = hex_color
						a['href'] = note_dict[strip_href]
					else:
						print('Found a reference to a note file that wasn\'t indexed to ES:', href)

		# prettify() seems to add newline characters that mess with the formatting
		# body = soup.prettify(formatter='html')

		with codecs.open(chap_path, 'w', encoding='utf-8') as file:
			file.write(str(soup))

		# Build op to update ES doc with HTML
		final_chap_file = io.open(chap_path, mode='r', encoding='utf-8')
		final_chap_html = final_chap_file.read()
		update_html_op = es_helpers.build_es_update_op(chapter_id, 'html_source', final_chap_html)
		chap_html_ops.append(update_html_op)
		final_chap_file.close()			

	# Update ES document with HTML ops
	es_helpers.index_seed_docs('chapters', chap_html_ops)
	print('Chapter HTML successfully indexed!')