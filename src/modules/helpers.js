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