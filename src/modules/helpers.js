import regex from '../modules/regex'

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
	documentsOfDocType: (docType, chapters, notes, tags, editions, media) => {
		switch(docType) {
			case 'chapters':
				return chapters
				break
			case 'notes':
				return notes
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