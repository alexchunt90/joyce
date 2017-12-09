import { combineReducers } from 'redux'

import notes from './notes'
import currentNote from './currentNote'
import editorState from './editorState'
import noteTitleInput from './noteTitleInput'
import mode from './mode'

const reduceNotes = combineReducers({
	notes,
	currentNote,
	editorState,
	mode,
	noteTitleInput
})

export default reduceNotes