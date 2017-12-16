import { combineReducers } from 'redux'

import notes from './notes'
import chapters from './chapters'
import currentDocument from './currentDocument'
import docType from './docType'
import mode from './mode'
import documentTitleInput from './documentTitleInput'
import editorState from './editorState'
import selectionState from './selectionState'
import annotationNote from './annotationNote'
import loadingToggle from './loadingToggle'

const reduceDocuments = combineReducers({
	notes,
	chapters,
	currentDocument,
	annotationNote,
	mode,
	documentTitleInput,
	editorState,
	docType,
	selectionState,
	loadingToggle
})

export default reduceDocuments