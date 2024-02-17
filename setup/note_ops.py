import os
import io
import re
import codecs
from bs4 import BeautifulSoup as bs, Tag

import setup.es_helpers as es_helpers
import setup.es_config as es_config

# Takes an element from BS4 and checks if next_sibling is a non-"<br/>"" HTML tag
# If yes, return tag name, if no, recurse to the next sibling
def find_next_sibling(element):
	if element:
		sibling = element.next_sibling
		if type(sibling) == Tag and sibling.name != 'br':
			return sibling
		else:
			return find_next_sibling(sibling)

def clear_white_space(html):
	return html.replace("    ", " ")

def clean_html_for_export(html):
	if html:
		string = str(html)
		cleaned_string = re.sub('\s{2,}', ' ', string)
		return cleaned_string


def import_note_operations(notes_path):
	note_file_ops = []
	note_title_ops = []
	note_media_ops = []
	note_html_ops = []
	img_caption_ops = []

	# Read in all notes and index their original file name
	notes_file_list = os.listdir(notes_path)

	for i in notes_file_list:
		if es_helpers.check_file_extension(i) != 'htm':
			continue
		op = es_helpers.build_es_create_op('file_name', i)
		note_file_ops.append(op)

	es_helpers.index_seed_docs('notes', note_file_ops)

	# Get those filenames back from Elasticsearch

	note_dict = es_helpers.es_document_dict('notes')
	media_dict = es_helpers.es_document_dict('media')

	# Iterate through the note HTML files
	for note in note_dict:
		note_path = notes_path + note
		note_id = note_dict[note]

		note_media = []

		if es_helpers.check_file_extension(note) != 'htm':
			continue

		html = open(note_path)
		soup = bs(html, 'html.parser',  preserve_whitespace_tags=['a', 'p'])
		html.close()

		def find_div(id):
			div = soup.find('div', {'id': id})
			return div

		# Remove script tags
		for script in soup.findAll('script'):	
			script.decompose()

		# # Update image references to point to new location
		images_div = find_div('images')
		if images_div:
			for e in images_div.children:
				# Img files are wrapped in an anchor tag
				if type(e) == Tag and e.name == 'a':
					href = e['href']
					if media_dict.__contains__(href):
						img_id = media_dict[href]
						next_sibling = find_next_sibling(e)
						# Add this image to this note
						note_media.append(img_id)
						# Some images won't have a caption paragraph
						if next_sibling and next_sibling.name == 'p':
							caption_p = find_next_sibling(e)
							caption_search_text = clear_white_space(caption_p.get_text())
							img_caption_data = {
								'id': img_id,
								'html_source': clean_html_for_export(caption_p),
								'search_text': [{'key': img_id, 'text': caption_search_text}]
							}
							caption_op = es_helpers.build_es_caption_op(img_caption_data)
							img_caption_ops.append(caption_op)
					else: print('Found a reference in note file {} to this image not present in files: {}'.format(note,href))
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
				## Can't append NavigableStrings
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
				if note_dict.__contains__(href):
					a['href'] = note_dict[href]

		body = clean_html_for_export(soup.find('body'))
		with codecs.open(note_path, 'w', encoding='utf-8') as file:
			file.write(body)

		# Build media attachment ops for this note
		attach_media_op = es_helpers.build_es_update_op(note_id, 'media_doc_ids', note_media)
		note_media_ops.append(attach_media_op)

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

	print('Note HTML successfully cleaned!')	

	# Index note contents to ES
	es_helpers.index_seed_docs('media', img_caption_ops)
	print('Image captions successfully indexed!')
	es_helpers.index_seed_docs('notes', note_title_ops)
	print('Note titles successfully indexed!')
	es_helpers.index_seed_docs('notes', note_media_ops)
	print('Note media successfully linked!')	
	es_helpers.index_seed_docs('notes', note_html_ops)
	print('Note HTML successfully indexed!')