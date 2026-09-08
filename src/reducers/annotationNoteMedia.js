// Media for the note open in the annotation modal. It follows the modal's lifecycle, not
// the current document's: on a refresh of /4?note=<id> the note's media can arrive before
// the chapter list selects the chapter, so clearing on SET_CURRENT_DOCUMENT (as this once
// did) wiped the images of a deep-linked note.
const annotationNoteMedia = (state=[], action) => {
	switch(action.type) {
		// Clear the previous note's media as soon as a new modal note is requested, so a
		// note without images does not keep showing the images of the one read before it
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request' && action.state === 'annotationNote') {
				return []
			} else {return state}
		case 'GET_MEDIA_DOCS':
			if (action.status === 'success' && action.modalNote === true) {
				return action.data
			} else {return state}
		// The modal closed, whether the reader dismissed it or the URL stopped naming a note
		case 'CLOSE_ANNOTATION_NOTE':
		case 'DISMISS_ANNOTATION_NOTE':
			return []
		default:
			return state
	}
}

export default annotationNoteMedia