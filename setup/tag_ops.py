import os

import setup.es_helpers as es_helpers

default_tag_ops = [
	es_helpers.build_es_create_tag_op('The Writer', 'These links address narrative styles, techniques, revisions, and effects, as well as textual variants, aesthetic theories, and the shaping of real lives into fictional ones.', '307EE3'),
	es_helpers.build_es_create_tag_op('The Body', 'These links encompass anatomy, sexuality, childbirth, eating, drinking, excretion, clothes, personal accessories, disease, death, medicines, poisons, the physiology of emotion, the vagaries of memory, mental illness, and dreams.', 'CF2929'),
	es_helpers.build_es_create_tag_op('Performances', 'Indicates notes about songs, operas, oratorios, stage plays, nursery rhymes, speeches, recitations, advertising pitches, prayers, liturgical rites, performative social gestures, and impromptu clowning.', 'AB59C2'),
	es_helpers.build_es_create_tag_op('Dublin', 'These notes point to landforms like the river and bay, the built environment such as streets, canals, buildings, bridges, trams, and statues, cultural ephemera such as money, and civic institutions.', '9C632A'),
	es_helpers.build_es_create_tag_op('Literature', 'These links signal allusions to published texts including poetry, fiction, drama, critical essays, history, philosophy, scripture, theology, science, biography, hagiography, travelogues, and newspapers.', 'F59627'),
	es_helpers.build_es_create_tag_op('Ireland', 'These notes refer to Irish history, politics, customs, language, humor, religion, mythology, economics, geography, modes of transportation, flora, fauna, and weather. ', '40B324'),
]

def import_tags(swap_path):
	es_helpers.index_seed_docs('tags', default_tag_ops)

	swap_files = os.listdir(swap_path)