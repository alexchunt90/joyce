import regex from '../modules/regex'

// The stable identifier for a content block, used as `data-search-key` in the stored
// HTML and as the key of the matching `search_text` entry.
//
// It must be computed the same way in both places. When they disagree, every search
// result links to a block that does not exist — the bug fixed in 55e813c, and the
// reason this lives in one function rather than being inlined twice.
//
// A block parsed from stored HTML carries its original key in `data.key`; that is
// preserved so anchors survive a save. A block created in the editor since the last
// save has none, and falls back to the key DraftJS generated for it.
export const searchKeyForBlock = block => block.data?.key || block.key

const helpers = {
	getChapterIDFromPath: (path, chapters) => {
		for (const chapter of chapters) {
			const number = regex.parseNumberFromPath(path)
			if (chapter.number == number) {
				return chapter.id
			}
		}
	},
	docTypeName: docType => {
		switch(docType) {
			case 'chapters':
				return 'Chapter'
				break
			case 'notes':
				return 'Note'
				break
			case 'tags':
				return 'Tags'
			case 'media':
				return 'Media'
				break
		}	
	},
	// The notes (~1,200 docs, 247KB) and media (~4,000 docs, 782KB) lists are by far the
	// largest, and a reader on a chapter needs neither, so they are no longer fetched at
	// boot. These say which routes do need them. Both src/joyce.js (direct load) and
	// joyceRouter (client-side navigation) ask, because ReduxRouter does not announce the
	// initial location.
	//
	// Notes are read by the notes sidebar list and by the two info pages derived from the
	// note corpus, Tally of Notes and Index of Titles — every one of which lives under a
	// /notes or /info path. Annotation links do not need the list: the modal fetches the
	// note it wants by id.
	notesListNeeded: path =>
		regex.checkEditRoute(path) ||
		(regex.checkIfDocTypePath(path) && regex.parseDocTypeFromPath(path) !== 'chapters'),
	// Media is only ever read in the editor: docType 'media' exists only under /edit, and
	// the annotation modal fetches a note's images through /api/media/bulk/.
	mediaListNeeded: path => regex.checkEditRoute(path),
	// TODO: I hate this function and need to reevaluate anywhere its used
	documentsOfDocType: (docType, chapters, notes, tags, editions, media, info) => {
		switch(docType) {
			case 'chapters':
				return chapters
				break
			case 'notes':
				return notes
				break
			case 'info':
				return info
				break				
			case 'tags':
				return tags
			case 'editions':
				return editions
			case 'media':
				return media
				break
		}	
	}	
}

export default helpers