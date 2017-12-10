import { combineReducers } from 'redux'

import notes from './notes'
import currentNote from './currentNote'
import mode from './mode'
import noteTitleInput from './noteTitleInput'
import editorState from './editorState'
import selectionState from './selectionState'
import annotationNote from './annotationNote'

const reduceNotes = combineReducers({
	notes,
	currentNote,
	annotationNote,
	mode,
	noteTitleInput,
	editorState,
	selectionState
})

export default reduceNotes