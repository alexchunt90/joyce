const helpers = {
	checkIfRedirectPath: path => {
		const match = /\/(\:id)$/.exec(path)
		if (match) {
			return true
		} else {
			return false
		}
	},
	parseNumberFromPath: path => {
		const match = /\/([0-9]*)$/.exec(path)
		if (match && parseInt(match[1])) {
			return Number(match[1])
		} else {
			return null
		}
	},
	parseIDFromPath: path => {
		const match = /\/([A-Za-z0-9\-\_]{18,})$/.exec(path)
		if (match) {
			return match[1]
		} else {
			return null
		}
	}	
}

export default helpers