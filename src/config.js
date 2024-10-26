export const bookDetails = {
	title: 'Ulysses',
	author: 'James Joyce'
}


const CSSClassObject = (name, className) => {
	return {
		'name': name,
		'className': className
	}
}

export const defaultTagColors = {
  green: '40b324',
  orange: 'F59627',
  brown: '9C632A',
  purple: 'AB59C2',
  red: 'CF2929',
  blue:'307EE3',
}

export const CUSTOM_CSS_CLASSES = [
	CSSClassObject('Header', 'header'),
	CSSClassObject('Subheader', 'subheader'),
	CSSClassObject('Serif Font', 'serif-font'),
	CSSClassObject('Stage Direction', 'stage-dir'),
	CSSClassObject('Character Tag', 'character-tag'),
	CSSClassObject('Question', 'question'),
	CSSClassObject('Bib', 'bib'),
	CSSClassObject('Page Break', 'break'),
	CSSClassObject('Dialog Lyrics', 'dialog-lyrics'),
	CSSClassObject('Newspaper Headline', 'headline'),
]


export const infoPageTitleConstants = {
	TALLY_INFO_PAGE_TITLE: 'Tally of Notes',
	NOTE_INDEX_INFO_PAGE_TITLE: 'Index of Titles',
	ABOUT_NOTES_INFO_PAGE_TITLE: 'About the Notes',
	COLOR_CODING_INFO_PAGE_TITLE: 'Color Coding',
	SUBJECT_INDEX_INFO_PAGE_TITLE: 'Subject Index'
}

// These are the paths for info pages that can be accessed through note routes
export const exemptNotePaths = ['/notes/tally', '/notes/index', '/notes/about', '/notes/color', '/notes/subject']

export const LATEST_TALLY = [
	{
	"count": 166,
	"title": "Telemachus"
	},
	{
	"count": 104,
	"title": "Nestor"
	},
	{
	"count": 220,
	"title": "Proteus"
	},
	{
	"count": 132,
	"title": "Calypso"
	},
	{
	"count": 134,
	"title": "Lotus Eaters"
	},
	{
	"count": 136,
	"title": "Hades"
	},
	{
	"count": 143,
	"title": "Aeolus"
	},
	{
	"count": 137,
	"title": "Lestrygonians"
	},
	{
	"count": 93,
	"title": "Scylla and Charybdis"
	},
	{
	"count": 105,
	"title": "Wandering Rocks"
	},
	{
	"count": 76,
	"title": "Sirens"
	},
	{
	"count": 110,
	"title": "Cyclops"
	},
	{
	"count": 75,
	"title": "Nausicaa"
	},
	{
	"count": 97,
	"title": "Oxen of the Sun"
	},
	{
	"count": 261,
	"title": "Circe"
	},
	{
	"count": 93,
	"title": "Eumaeus"
	},
	{
	"count": 148,
	"title": "Ithaca"
	},
	{
	"count": 99,
	"title": "Penelope"
	}
]