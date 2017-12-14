export const getFirstDocument = (store, docType) => {
	switch(docType) {
		case 'chapters':
			return store.getState().chapters[0]
		case 'notes':
			return store.getState().notes[0]
	}
}