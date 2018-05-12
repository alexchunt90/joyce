const regexCheckBaseFunction = (path, pattern) => {
	const match = pattern.exec(path)
	if (match) {
		return true
	} else {
		return false
	}	
}

const regexParseBaseFunction = (path, pattern) => {
	const match = pattern.exec(path)
	if (match) {
		return match[1]
	} else {
		return null
	}
}

const regex = {
	checkIfRedirectPath: path => {
		return regexCheckBaseFunction(path, /\/(\:id)$/)
	},
	checkNoteBaseRoute: path => {
		return regexCheckBaseFunction(path, /^\/notes$/)
	},
	checkEditBaseRoute: path => {
		return regexCheckBaseFunction(path, /^\/edit$/)
	},
	checkEditRoute: path => {
		return regexCheckBaseFunction(path, /^\/edit\//)
	},		
	checkNoteReaderRoute: path => {
		return regexCheckBaseFunction(path, /^\/notes\/([0-9a-zA-Z\-\_]{18,}|\:id)/)
	},
	checkChapterEditorRoute: path => {
		return regexCheckBaseFunction(path, /^\/edit\/([0-9]{1,3}|\:id)/)
	},	
	checkNoteEditorRoute: path => {
		return regexCheckBaseFunction(path, /^\/edit\/notes\/([0-9a-zA-Z\-\_]{18,}|\:id)/)
	},
	checkTagEditorRoute	: path => {
		return regexCheckBaseFunction(path, /^\/edit\/tags\/([0-9a-zA-Z\-\_]{18,}|\:id)/)
	},
	checkPathForNumber: path => {
		return regexCheckBaseFunction(path, /\/[0-9]{1,3}$/)
	},
	checkRootRedirectRoute: path => {
		return regexCheckBaseFunction(path, /^\/\:id$/)
	},
	checkPathForID: path => {
		return regexCheckBaseFunction(path, /\/([0-9A-Za-z0-9\-\_]{18,})$/)
	},	
	parseNumberFromPath: path => {
		return Number(regexParseBaseFunction(path, /\/([0-9]{1,3})$/))
	},
	parseIDFromPath: path => {
		return regexParseBaseFunction(path, /\/([0-9A-Za-z0-9\-\_]{18,})$/)
	}	
}

export default regex