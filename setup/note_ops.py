import os
import io
import re
import copy
import codecs
from bs4 import BeautifulSoup as bs, Tag, NavigableString

import setup.es_helpers as es_helpers
import setup.es_config as es_config
import setup.media_counter as media_count
import blueprints.es_func as es_func

# Used for debugging individual notes
logging_note = '070068experience.htm'

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
		string = str(html).replace('<br>', '<br/>').replace('</br>', '<br/>')
		string_without_tabs = re.sub(r'<br/>\s{1,}', '<br/>', string)
		string_without_blockquote_brs = re.sub(r'<br/>((</i>|</a>|\s){0,}</blockquote>)', r'\1', string_without_tabs)
		string_with_colon_spaces = re.sub(r'\:([A-Za-z])', r'\: \1', string_without_blockquote_brs)
		cleaned_string = re.sub(r'\s{2,}', ' ', string_with_colon_spaces)
		cleaned_string = cleaned_string.replace('<p> ', '<p>').replace('<blockquote> ', '<blockquote>').replace(' </i> ', '</i> ')
		cleaned_string = cleaned_string.replace(' :', ':').replace(' .', '.').replace(' ,', ',').replace('––', '—')
		return cleaned_string


def import_note_operations(notes_path):
	note_file_ops = []
	note_title_ops = []
	note_media_ops = []
	note_html_ops = []
	img_caption_ops = []

	missing_media_count = 0

	# Some source html files contain a blend of p tags and raw navigable strings.
	notes_with_string_errors = []

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
		h = html.read().encode('utf-8')
		soup = bs(h, 'html.parser',  preserve_whitespace_tags=['a', 'p'])
		html.close()

		image_count = len(soup.find_all('img'))
		iframe_count = len(soup.find_all('iframe')) + len(soup.find_all('object'))

		def find_div(id):
			div = soup.find('div', {'id': id})
			return div

		# Remove script tags
		for script in soup.findAll('script'):	
			script.decompose()

		for br in soup.find_all("br"):
			if br.parent.name != 'blockquote':
				br.decompose()


		for s in soup.findAll('span'):
			for sc in s.contents:
				s.insert_before(sc)


		# IMAGE PROCESSING
		# ----------------
		images_processed = media_count.MediaCounter()
		iframes_processed = media_count.MediaCounter()

		def triage_element_from_img_div(element, self_reference=None):
			if self_reference is None:
				self_reference = element
			if type(element) == Tag and element.name in ['a', 'img']:
				images_processed.increment()
				add_image_to_note(element, self_reference)
			if type(element) == Tag and element.name in ['iframe', 'object']:
				iframes_processed.increment()
				add_embed_to_note(element, self_reference)
				for t in element.children:
					triage_element_from_img_div(t, element)
			if type(element) == Tag and element.name in ['p']:
				for t in element.children:
					triage_element_from_img_div(t, element)

		def create_caption(id, html):
			search_text = clear_white_space(html.get_text())
			img_caption_data = {
				'id': id,
				'html_source': clean_html_for_export(html),
				'search_text': [{'key': id, 'text': search_text}]
			}
			return img_caption_data

		def check_for_caption_sibling(sibling,  media_id):
			if sibling and sibling.name == 'p':
				if note == '140025olebillyo.htm':
					print('------')
					print(sibling)
					print(re.match(r'^\s{0,}$', sibling.text))
				if not re.match(r'^\s{0,}$', sibling.text):
					cap_soup = bs(str(sibling), 'html.parser')
					caption_p = cap_soup.find('p')
					# Clean up note images in caption paragraphs 
					for c in caption_p.children:
						if c.name =='a' and c.has_attr('href'):
							if c['href'].startswith('episode'):
								c.decompose()
					img_caption_data = create_caption(media_id, caption_p)
					caption_op = es_helpers.build_es_caption_op(img_caption_data)
					img_caption_ops.append(caption_op)
				else:
					#This handles blank <p> tags in between media and caption
					next_sibling = find_next_sibling(sibling)
					check_for_caption_sibling(next_sibling, media_id)

		def add_embed_to_note(element, self_reference):
			next_sibling = find_next_sibling(self_reference)
			youtube_url = ''
			if element.name == 'iframe' and element.has_attr('src'):
				youtube_url = element['src']
			elif element.name == 'object':
				param = element.contents[0]
				object_value = element.contents[0]['value']
				youtube_id = re.sub(r'.*youtube.com/v/([a-zA-Z0-9\_\-]*)\?.*', r'\1', object_value)
				youtube_url = f'https://youtube.com/embed/{youtube_id}'
			
			response = es_func.index_and_save_media_embed(youtube_url, None, None, es_helpers.es)
			embed_id = response['_id']
			if embed_id not in note_media:
				note_media.append(embed_id)
			check_for_caption_sibling(next_sibling, embed_id)

		def add_image_to_note(element, self_reference):
			next_sibling = find_next_sibling(self_reference)

			href = ''
			if element.name == 'a' and element.has_attr('href') :
				href = element['href']
			elif element.name == 'img':
				href = element['src']
			
			if media_dict.__contains__(href):
				img_id = media_dict[href]
				if img_id not in note_media:
					note_media.append(img_id)		
				check_for_caption_sibling(next_sibling, img_id)
			# else: print(f'Found a reference in note file {note} to this image not present in files: {href}'.

		# # Update image references to point to new location
		images_div = find_div('images') or find_div('media')

		if images_div:
			for e in images_div:
				triage_element_from_img_div(e)

			# Check for missed media
			if image_count != images_processed.counter:
				# print(f'The note file {note} has {image_count} <img> tags, but after processing, the note has {images_processed.counter} media links.')
				missing_media_count += 1
			if iframe_count != iframes_processed.counter:
				# print(f'The note file {note} has {image_count} <iframe> tags, but after processing, the note has {iframes_processed.counter} media links.')
				missing_media_count += 1	

			images_div.decompose()


		# Remove button div
		button_div = find_div('button')
		if button_div:
			button_div.decompose()

		# Remove title p tag
		title_p = soup.find('p', {'class': 'title'})
		if title_p:
			title_p.decompose()

		def create_note_subheader(text):
			subheader_p = soup.new_tag('p')
			bold_tag = soup.new_tag('i')
			subheader_p.string = text
			subheader_p.string.wrap(bold_tag)
			subheader_p['data-align'] = 'left'
			subheader_p['data-indent'] = 'none'
			subheader_p['data-custom-classes'] = 'subheader'
			return subheader_p

		# Standardize tags to i and b
		# Replace em tags
		for em in soup.findAll('em'):
			em.name = 'i'
		# Replace strong tags
		for strong in soup.findAll('strong'):
			strong.name = 'b'

		# Fix file references
		for a in soup.findAll('a'):
			if not a.has_attr('href'):
				continue
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

		# Combine note divs
		note_div = find_div('note')
		if note_div:
			first_element = note_div.contents[0]
			overview_p = create_note_subheader('In brief')
			first_element.insert_before(overview_p)

		expanded_note_div = find_div('expandednote')
		if expanded_note_div:
			readmore_p = create_note_subheader('At more length')
			note_div.append(readmore_p)
			for p in expanded_note_div.children:
				# Handling for raw strings outside of top-level section elements
				last_element = note_div.contents[-1]



				if type(p) == Tag:
					# Add top-level section elements to the note_div
					tag = copy.copy(p)
					section_tags = ['p', 'blockquote', 'br', 'h1', 'h2', 'h3', 'h4']
					if tag.name in section_tags and not re.match(r'^\s+$', tag.text):
						note_div.append(tag)
					# If the parser finds a top-level tag that should be nested in a section element, it will append it to the last element in the note_div
					format_tags = ['a', 'i', 'b']
					if tag.name in format_tags:
						last_element.append(tag)
				if type(p) == NavigableString and not re.match(r'^\s+$', p.text):
					raw_string = str(p.string).lstrip()
					last_element = note_div.contents[-1]

					# If the string doesn't start with a lowercase letter, create a new 'p' tag and append it
					if re.match(r'[A-Z]', raw_string) and (re.match(r'(\.|\")$', last_element.text.strip()[-1]) or last_element.has_attr('data-custom-classes')):

						new_p = soup.new_tag('p')
						new_p.string = p.string
						note_div.append(new_p)					

					# Otherwise append it to the last element in the note_div
					else:
						if not re.match(r'.*\s$', last_element.text):
							last_element.append(' ')
						last_element.append(raw_string)
			expanded_note_div.decompose()
		return_div = find_div('return')
		if return_div and note_div:
			contributor_text = return_div.get_text()
			contributor_p = soup.new_tag('p')
			contributor_p.string = contributor_text.strip()
			contributor_p['data-custom-classes'] = 'subheader'
			contributor_p['data-indent'] = 'none'
			note_div.append(contributor_p)

		if note_div:	

			note_div.name = 'body'
			cleaned_div = clean_html_for_export(note_div)
			with codecs.open(note_path, 'w') as file:
				file.write(cleaned_div)
			# Build media attachment ops for this note
			attach_media_op = es_helpers.build_es_update_op(note_id, 'media_doc_ids', note_media)
			note_media_ops.append(attach_media_op)

			# Build ES Op to Index Title
			note_title = soup.title.get_text().strip()
			update_title_op = es_helpers.build_es_update_op(note_id, 'title', note_title)
			note_title_ops.append(update_title_op)

			# Build ES Op to Index HTML
			final_note_file = io.open(note_path, mode='r')
			final_note_html = final_note_file.read()
			update_html_op = es_helpers.build_es_update_op(note_id, 'html_source', final_note_html)
			note_html_ops.append(update_html_op)
			final_note_file.close()
		else:
			print('No note found for file {}.'.format(note))

	# print(f'There are {iframe_count} iframes in the notes.')
	print('Found {} notes with string errors:'.format(len(notes_with_string_errors)))
	# print(notes_with_string_errors)
	print(f'Encountered {missing_media_count} notes with fewer media than expected.')
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