import regex from '../modules/regex'

const helpers = {
	getChapterIDFromPath: (path, chapters) => {
		for (const chapter of chapters) {
			const number = regex.parseNumberFromPath(path)
			if (chapter.number == number) {
				return chapter.id
			}
		}
	}	
}

export default helpers