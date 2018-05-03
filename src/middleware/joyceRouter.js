export const joyceRouter = store => next => action => {
	next(action)
	switch(action.type) {
		case '@@router/LOCATION_CHANGE':
			const path = action.payload.pathname
			const docType = store.getState().docType
			const currentDocument = store.getState().currentDocument
			switch(path) {
				case /^\/[0-9]{,3}/.test(path):
					// set docType = 'chapters'
					// set Current Chapter
				case /^\/notes\/[a-zA-Z\-\_]{18,}/.test(path):
					// set docType = 'notes'
					// set current note
				case /^\/edit\/notes\/[a-zA-Z\-\_]{18,}]/.test(path):
					// set docType = 'chapters'
					// set Current Chapter
				// case: if /edit/ and docType = notes => /edit/notes/
				// case: if redirectURL
			}
		default:
			break
	}
}


export default joyceRouter