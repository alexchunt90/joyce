import setup.es_helpers as es_helpers

def serialize_p_tag(str):
	return '<p>{}</p>'.format(str)

default_edition_ops = [
	es_helpers.build_es_create_edition_op('First Edition', 1922, serialize_p_tag('First edition pagination reproduces the pages of the original 1922 Shakespeare and Company edition, reprinted in recent years as an Orchises Press hardcover facsimile and as Oxford University Press and Dover Publications paperbacks.')),
	es_helpers.build_es_create_edition_op('Wordsworth Edition', 1932, serialize_p_tag('Wordsworth pagination reproduces the pages of the paperback issued by Wordsworth Editions, based on the first Odyssey Press edition of 1932.')),
	es_helpers.build_es_create_edition_op('Alma Classics Edition', 1939, serialize_p_tag('Alma Classics pagination reproduces the pages of hardcover and paperback books printed by Alma Classics Ltd., using the fourth and final Odyssey Press edition of 1939.')),
	es_helpers.build_es_create_edition_op('Modern Library Edition', 1961, serialize_p_tag('Modern Library pagination reproduces the pages of the hardcover Modern Library text as re-edited in 1961, also sold by Random House as Vintage paperbacks.')),
	es_helpers.build_es_create_edition_op('Gabler Edition', 1986, serialize_p_tag(
		'''Gabler pagination reproduces the pages of Random House's 1986 edition, also printed in Vintage paperbacks, 
			which presents a slightly revised version of Hans Walter Gabler's 1984 three-volume Garland edition.
			The Gabler Ulysses, touted at its release as "the corrected text" but eviscerated soon afterward by John Kidd, 
			is still seen by many professional Joyceans, despite the controversy, as by far the best available version. 
			I take a skeptical approach to this canonical text, questioning both the literary merits of particular editorial 
			choices and the underlying methodology of privileging early textual variants over ones ratified later in the 
			publication history.  When in doubt, I prefer to err on the side of trusting the process by which the errata-riddled 
			text of 1922 was slowly improved in printings that Joyce authorized. Many of my notes comment on Gabler's 
			changes—sometimes affirmatively,  sometimes critically, and sometimes simply to ask how adopting them might affect 
			the reading of a passage.'''
	)),
]

def import_editions():
	es_helpers.index_seed_docs('editions', default_edition_ops)