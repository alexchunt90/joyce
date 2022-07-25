import os
import io
import re
import codecs

from HTMLParser import HTMLParser
from bs4 import BeautifulSoup as bs, Tag

import es_helpers
import es_config

def import_note_operations(target_path):
	note_file_ops = []
	note_title_ops = []
	note_html_ops = []

	# Read in all notes and index their original file name
	notes_path = target_path + 'notes/'
	notes_file_list = os.listdir(notes_path)
	for i in notes_file_list:
		if i == '.DS_Store':
			continue
		op = es_helpers.build_es_create_op('file_name', i)
		note_file_ops.append(op)

	es_helpers.index_seed_docs('notes', note_file_ops)

	# Get those filenames back from Elasticsearch

	note_dict = es_helpers.es_document_dict('notes')

	# Iterate through the note HTML files
	for note in note_dict:
		note_path = notes_path + note
		note_id = note_dict[note]

		if note == '.DS_Store':
			continue

		html = open(note_path)
		soup = bs(html, 'html.parser')
		html.close()

		def find_div(id):
			div = soup.find('div', {'id': id})
			return div

		# Remove script tags
		for script in soup.findAll('script'):	
			script.decompose()

		# Remove images
		# // REMOVE THIS ONCE IMAGES ARE INTEGRATED
		images_div = find_div('images')
		if images_div:
			images_div.decompose()

		# Remove return
		return_div = find_div('return')
		if return_div:
			return_div.decompose()	

		# Remove button div
		button_div = find_div('button')
		if button_div:
			button_div.decompose()

		# Remove title p tag
		title_p = soup.find('p', {'class': 'title'})
		if title_p:
			title_p.decompose()

		# Combine note divs
		note_div = find_div('note')
		expanded_note_div = find_div('expandednote')
		if expanded_note_div:
			for p in  expanded_note_div.contents:
				## Appending breaks if NavigableStrings are included
				if type(p) == Tag:
					note_div.append(p)
			expanded_note_div.decompose()

		# Standardize tags to i and b
		# Replace em tags
		for em in soup.findAll('em'):
			em.name = 'i'
		# Replace strong tags
		for strong in soup.findAll('strong'):
			strong.name = 'b'		

		# Fix file references
		for a in soup.findAll('a'):
			href = a['href']
			if href.startswith('file:'):
				rexp = re.compile(r'.*\/notes\/([0-9a-z]*\.htm)')
				f = rexp.search(href)
				fixed_path = f.group(1)
				a['href'] = fixed_path

			href = a['href']			
			if href.endswith('.htm'):				
				if note_dict.has_key(href):
					a['href'] = note_dict[href]

		body = soup.find('body').prettify(formatter='html').replace('\n', ' ')
		final_text = re.sub('\s{2,}', ' ', body)

		with codecs.open(note_path, 'w', encoding='utf-8') as file:
			file.write(unicode(final_text))

		# Build ES Op to Index Title
		note_title = soup.title.get_text()
		update_title_op = es_helpers.build_es_update_op(note_id, 'title', note_title)
		note_title_ops.append(update_title_op)

		# Build ES Op to Index HTML
		final_note_file = io.open(note_path, mode='r', encoding='utf-8')
		final_note_html = final_note_file.read()
		update_html_op = es_helpers.build_es_update_op(note_id, 'html_source', final_note_html)
		note_html_ops.append(update_html_op)
		final_note_file.close()

	print 'Note HTML successfully cleaned!'	


	# Index note contents to ES
	es_helpers.index_seed_docs('notes', note_title_ops)
	print 'Note titles successfully indexed!'
	es_helpers.index_seed_docs('notes', note_html_ops)
	print 'Note HTML successfully indexed!'