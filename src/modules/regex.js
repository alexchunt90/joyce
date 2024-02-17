const regexCheckBaseFunction = (path, pattern) => {
	const match = pattern.exec(path)
	if (match) {
		return true
	} else {
		return false
	}	
}

const regexParseBaseFunction = (path, pattern, n=1) => {
	const match = pattern.exec(path)
	if (match) {
		return match[n]
	} else {
		return null
	}
}

const patterns = {
	PATH_WITH_NUMBER: /\/([0-9]{1,3})$/,
	PATH_ROOT_WITH_NUMBER: /^\/([0-9]{1,3})$/,
	PATH_WITH_ID: /\/([0-9A-Za-z0-9\-\_]{18,})$/,
	PATH_ROOT_WITH_ID: /\/([0-9A-Za-z0-9\-\_]{18,})$/,
	PATH_WITH_DOC_TYPE: /^\/(edit\/)*(notes|tags|chapters|editions|media|info)/,
	PATH_WITH_ID_REDIRECT: /\/(\:id)$/,
	PATH_ROOT: /^\/(\:id)*$/,
	PATH_EDITOR: /^\/edit(\/)*/,
	PATH_BASE_EDITOR: /^\/edit$/,
	HEX_COLOR: /(^[0-9A-F]{6})$|(^[0-9A-F]{3}$)/,
	IS_INTEGER: /^[0-9]*$/
}

const regex = {
	// Route Checks
	checkPathForNumber: path => {
		return regexCheckBaseFunction(path, patterns.PATH_WITH_NUMBER)
	},
	checkIfRootPathWithNumber: path => {
		return regexCheckBaseFunction(path, patterns.PATH_ROOT_WITH_NUMBER)
	},	
	checkPathForID: path => {
		return regexCheckBaseFunction(path, patterns.PATH_WITH_ID)
	},
	checkIfRootPathWithID: path => {
		return regexCheckBaseFunction(path, patterns.PATH_ROOT_WITH_ID)
	},	
	checkIfDocTypePath: path => {
		return regexCheckBaseFunction(path, patterns.PATH_WITH_DOC_TYPE)
	},
	checkIfRedirectPath: path => {
		return regexCheckBaseFunction(path, patterns.PATH_WITH_ID_REDIRECT)
	},
	checkIfRootPath: path => {
		return regexCheckBaseFunction(path, patterns.PATH_ROOT)
	},
	checkEditRoute: path => {
		return regexCheckBaseFunction(path, patterns.PATH_EDITOR)
	},		
	checkEditBaseRoute: path => {
		return regexCheckBaseFunction(path, patterns.PATH_BASE_EDITOR)
	},
	// Route Parsers
	parseNumberFromPath: path => {
		return Number(regexParseBaseFunction(path, patterns.PATH_WITH_NUMBER))
	},
	parseIDFromPath: path => {
		return regexParseBaseFunction(path, patterns.PATH_WITH_ID)
	},
	parseDocTypeFromPath: path => {
		return regexParseBaseFunction(path, patterns.PATH_WITH_DOC_TYPE, 2)
	},
	checkColorPickerHexValue: input => {
		return regexCheckBaseFunction(input, patterns.HEX_COLOR)
	},
	// Input Checks
	checkIntegerInput: input => {
		return regexCheckBaseFunction(input, patterns.IS_INTEGER)
	}

}

export default regex