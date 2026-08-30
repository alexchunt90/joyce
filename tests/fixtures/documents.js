// Hand-built fixtures covering every construct src/modules/draftConversion.js knows
// how to translate. Synthetic rather than pulled from Elasticsearch so the suite
// runs with nothing else up; a real chapter would add realistic edge cases and is
// worth adding to this file later.

// One block of each supported type, carrying each supported data attribute.
export const ALL_BLOCK_TYPES = [
	'<p data-search-key="p0001" data-align="left" data-custom-classes="">A plain paragraph.</p>',
	'<h1 data-search-key="h1001" data-align="left" data-custom-classes="">Heading one</h1>',
	'<h2 data-search-key="h2001" data-align="center" data-custom-classes="">Heading two</h2>',
	'<h3 data-search-key="h3001" data-align="left" data-custom-classes="">Heading three</h3>',
	'<blockquote data-search-key="bq001" data-align="left" data-indent="true" data-custom-classes="verse italic">Introibo ad altare Dei.</blockquote>',
].join('')

// The three entity types: annotation links, external URLs, and page breaks.
export const ALL_ENTITY_TYPES = [
	'<p data-search-key="e0001" data-align="left" data-custom-classes="">',
	'Stately, plump <a href="note-abc" data-color="FF0000" data-tag="tag-xyz" data-type="annotation">Buck Mulligan</a> came from the stairhead.',
	'</p>',
	'<p data-search-key="e0002" data-align="left" data-custom-classes="">',
	'See <a href="https://example.com/ulysses" data-type="external_url">this edition</a> for context.',
	'</p>',
	'<p data-search-key="e0003" data-align="left" data-custom-classes="">',
	'Text before the break<span data-edition="1922" data-page="12">1922#12</span>and text after it.',
	'</p>',
].join('')

// An inline image block (DraftJS 'atomic').
export const WITH_IMAGE =
	'<img data-search-key="i0001" data-align="center" data-custom-classes="" src="/img/media-1/img.jpg" data-media-id="media-1"/>'

// A document paginated across three pages of the 1922 edition. Page breaks are
// placed mid-paragraph, which is how they fall in the real text and which forces
// paginate() to split blocks. The trailing paragraph deliberately sits after the
// final break — see paginate.test.js for what becomes of it.
export const PAGINATED_1922 = [
	'<p data-search-key="pg001" data-align="left" data-custom-classes="">',
	'Page one opening line.<span data-edition="1922" data-page="1">1922#1</span>Page two begins here.',
	'</p>',
	'<p data-search-key="pg002" data-align="left" data-custom-classes="">',
	'Still on page two.<span data-edition="1922" data-page="2">1922#2</span>Page three begins.',
	'</p>',
	'<p data-search-key="pg003" data-align="left" data-custom-classes="">',
	'Start of three<span data-edition="1922" data-page="3">1922#3</span>and the remainder after the break.',
	'</p>',
	'<p data-search-key="pg004" data-align="left" data-custom-classes="">',
	'Trailing text with no break at all.',
	'</p>',
].join('')

// The same shape but for an edition that is not being paginated, used to check
// that breaks belonging to other editions are ignored.
export const PAGINATED_1961 =
	'<p data-search-key="ed001" data-align="left" data-custom-classes="">' +
	'Text for another edition.<span data-edition="1961" data-page="1">1961#1</span>More text.' +
	'</p>'

export const EDITION_1922 = { year: 1922, title: 'Shakespeare and Company' }
