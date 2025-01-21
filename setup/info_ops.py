import os
import io
import re
import codecs
from bs4 import BeautifulSoup as bs, Tag

import setup.es_helpers as es_helpers
import setup.es_config as es_config

def import_info_operations(info_pages_path):
	info_file_ops = []
	info_title_ops = []
	info_html_ops = []
	info_number_ops = []

	note_dict = es_helpers.es_document_dict('notes')

	count = 1

	# Read in all info pages and index their original file name
	info_file_list = os.listdir(info_pages_path)

	for i in info_file_list:
		if es_helpers.check_file_extension(i) != 'htm':
			continue
		op = es_helpers.build_es_create_op('file_name', i)
		info_file_ops.append(op)

	es_helpers.index_seed_docs('info', info_file_ops)

	# Get those filenames back from Elasticsearch
	info_dict = es_helpers.es_document_dict('info')

	# Iterate through the info pages HTML files
	for info in info_dict:
		info_path = info_pages_path + info
		info_id = info_dict[info]

		if es_helpers.check_file_extension(info) != 'htm':
			continue

		html = open(info_path)
		h = html.read().encode('utf-8')
		soup = bs(h, 'html.parser',  preserve_whitespace_tags=['a', 'p'])
		html.close()

		def find_div(id):
			div = soup.find('div', {'id': id})
			return div

		# Remove unused tags tags
		for table in soup.findAll('table'):	
			table.decompose()

		# Standardize tags to i and b
		# Replace em tags
		for em in soup.findAll('em'):
			em.name = 'i'
		# Replace strong tags
		for strong in soup.findAll('strong'):
			strong.name = 'b'	

		# Build ES Op to Index Title
		info_title = soup.title if soup.title else soup.h2
		info_title_text = info_title.get_text().strip()
		update_title_op = es_helpers.build_es_update_op(info_id, 'title', info_title_text)
		info_title_ops.append(update_title_op)

		for a in soup.findAll('a'):
			if a.has_attr('href'):
				href = a['href']
				strip_href = href[len('../notes/'):]
				if href.endswith('.htm') and href.startswith('../notes/'):
					del a['class']
					del a['id']
					if note_dict.__contains__(strip_href):
						a['href'] = note_dict[strip_href]
					else:
						print('Found a reference to a note file that wasn\'t indexed to ES:', href)
		
		for h in soup.findAll('h2'):
			h.decompose()
		body = str(soup.find('body'))
		cleaned_string = re.sub(r'\s{2,}', ' ', body)


		with codecs.open(info_path, 'w') as file:
			file.write(cleaned_string)

		update_number_op = es_helpers.build_es_update_op(info_id, 'number', count)
		info_number_ops.append(update_number_op)
		count = count + 1

		# Build ES Op to Index HTML
		final_info_file = io.open(info_path, mode='r')
		final_info_html = final_info_file.read()
		update_html_op = es_helpers.build_es_update_op(info_id, 'html_source', final_info_html)
		info_html_ops.append(update_html_op)
		final_info_file.close()

	print('Info HTML successfully cleaned!')	

	# Index info contents to ES
	es_helpers.index_seed_docs('info', info_title_ops)
	es_helpers.index_seed_docs('info', info_html_ops)
	es_helpers.index_seed_docs('info', info_number_ops)
	print('Info HTML successfully indexed!')