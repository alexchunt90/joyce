import os
import io
import re
import codecs
from bs4 import BeautifulSoup as bs, Tag

from . import es_helpers
from . import es_config
from . import tag_ops

def clean_html_for_export(html):
	# return str(html)
	if html:
		string = str(html).replace('<!-- topofpage -->', '').replace('\n', ' ').replace('> <i', '><i').replace('<br>', '<br/>').replace('</br>', '<br/>')
		string_without_tabs = re.sub('<br/>\s{1,}', '<br/>', string)
		string_without_double_brs = re.sub(r'(<br/>)\1+', '<br/>', string_without_tabs)
		string_without_blockquote_brs = re.sub(r'<br/>((</i>|</a>|\s){0,}</blockquote>)', r'\1', string_without_double_brs)
		cleaned_string = re.sub('\s{2,}', ' ', string_without_blockquote_brs)

		# # # Prevent spaces on either side of a tags being rendered as double spaces
		double_space_pattern = r'(\s<a[\sa-z\-\=\\\"0-9\>\#]*</a>)\s'
		new_cleaned_string = re.sub('(\s<span[\sa-z\-\=\\\"0-9\>\#]*</span>)\s',r'\1',cleaned_string)
		return new_cleaned_string

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
append_chapter(chapter_list, 4, 'Calypso', 'calypso')
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
	media_dict = es_helpers.es_document_dict('media')
	chapter_dict = es_helpers.es_document_dict('chapters')

	# Parse Swap JS files to find the hex colors for each chapter's links
	swap_path = 'setup/target/swap/'
	annotation_dict = tag_ops.parse_chapter_annotations(swap_path)

	# Iterate through chap files
	for c in chapter_dict:
		if es_helpers.check_file_extension(c) != 'php':
			continue
		print('Generating chapter file:', c)

		chap_path = chapters_path + c
		chapter_id = chapter_dict[c]
		html = open(chap_path)
		h = html.read()
		soup = bs(h, 'html.parser')
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
			else:
				s.name = 'i'

		images = soup.findAll('img')
		if images:
			for i in images:
				parent = i.parent
				src = i['src']
				import_src = 'images/{}'.format(src) # Manually move chapter media to images/images/ for import
				if media_dict.__contains__(import_src):
					img_id = media_dict[import_src]
					file_ext = os.path.splitext(import_src)[1]
					i['src'] = '/static/img/{}/img{}'.format(img_id, file_ext)
					i['data-media-id'] = img_id
					i['data-align'] = 'center'
				if parent and parent.name == 'p':
					img_tag = i.extract()
					parent.insert_before(img_tag)
					parent.decompose()

		for h in soup.findAll('h2'):
			h['data-align'] = 'center'
			is_aeolus = chap_name == 'aeolus'
			has_class_attr = h.has_attr('class')
			if is_aeolus and not has_class_attr:
				h['data-custom-classes'] = 'serif-font headline'
				h.name = 'h3'

		# Reformat chapter numbers
		for center in soup.findAll('center'):
			center['data-align'] = 'center'
			font = center.find(attrs={'size': '+3'})
			if font:
				center['data-custom-classes'] = 'serif-font header'
				center.name = 'h1'
			else:
				center.name = 'h2'
				center['data-custom-classes'] = 'header'
		# Reformat lyrics
		for p in soup.findAll('p'):
			p['data-indent'] = 'true'
			if p.has_attr('style'):
				if 'text-align:center' in p['style']:
					p['data-align'] = 'center'
				if 'text-align:right' in p['style']:	
					p['data-align'] = 'right'
				if 'padding-left:9cm' in p['style']:
					p['data-align'] = 'right'
			if p.has_attr('class'):
				if 'character-tag' in p['class']:
					p['data-custom-classes'] = 'character-tag'
				if 'question' in p['class']:
					p['data-custom-classes'] = 'question'
				if 'bib' in p['class']:
					p['data-indent'] = 'false'
					p['data-custom-classes'] = 'bib'
				blockquote_classes = ['lyrics', 'dialog-lyrics', 'stage-dir']
				for c in blockquote_classes:
					if c in p['class']:
						p['data-indent'] = 'false'
						if c == 'stage-dir':
							p['data-custom-classes'] = c
						if c == 'dialog-lyrics':
							p['data-custom-classes'] = c
						p.name = 'blockquote'
				center_align_classes = ['character-tag', 'break']
				for c in center_align_classes:
					if c in p['class']:
						p['data-align'] = 'center'
					if p['class'] == 'break':
						p['data-custom-classes'] = 'break'
				if 'break' in p['class']:
					p['data-indent'] = 'false'

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

		# Special handling for the Ithaca ledger table
		for table in soup.findAll('table'):
			if chap_name == 'ithaca':
				setup_src = 'images/images/ledger.png'
				if media_dict.__contains__(setup_src):
					ledger_id = media_dict[setup_src]
					ledger_src = '/static/img/{}/img.png'.format(ledger_id)
					ledger_img = soup.new_tag('img', src=ledger_src)
					table.insert_before(ledger_img)
					table.decompose()


		html_string = clean_html_for_export(soup)
		with codecs.open(chap_path, 'w') as file:
			file.write(html_string)

		# Build op to update ES doc with HTML
		final_chap_file = io.open(chap_path, mode='r')
		final_chap_html = final_chap_file.read()
		update_html_op = es_helpers.build_es_update_op(chapter_id, 'html_source', final_chap_html)
		chap_html_ops.append(update_html_op)
		final_chap_file.close()			

	# Update ES document with HTML ops
	es_helpers.index_seed_docs('chapters', chap_html_ops)
	print('Chapter HTML successfully indexed!')