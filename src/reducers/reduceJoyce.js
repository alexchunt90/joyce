 // node_modules
import { combineReducers } from 'redux'
import { createRouterReducer, createRouterReducerMapObject } from '@lagunovsky/redux-react-router'

// Documents
import chapters from './chapters'
import notes from './notes'
import info from './info'
import tags from './tags'
import editions from './editions'
import media from './media'
import currentDocument from './currentDocument'
import currentBlock from './currentBlock'
import annotationNote from './annotationNote'
import annotationNoteMedia from './annotationNoteMedia'
import readerNoteMedia from './readerNoteMedia'
import annotationTag from './annotationTag'
import searchResults from './searchResults'

// User Inputs
import inputs from './inputs'
import editorState from './editorState'
import modalEditorState from './modalEditorState'
import selectionState from './selectionState'

import docType from './docType'
import mode from './mode'
import paginationState from './paginationState'
// Toggles
import toggles from './toggles'

// Validation
import userErrors from './userErrors'
import user from './user'



const reduceJoyce = (history) => combineReducers({
	...createRouterReducerMapObject(history),
	// Documents
	chapters: chapters,
	notes: notes,
	info: info,
	tags: tags,
	editions: editions,
	media: media,
	currentDocument: currentDocument,
	currentBlock: currentBlock,
	annotationNote: annotationNote,
	annotationNoteMedia: annotationNoteMedia,
	readerNoteMedia: readerNoteMedia,
	annotationTag: annotationTag,
	searchResults: searchResults,
	// User Inputs
	editorState: editorState,
	modalEditorState: modalEditorState,
	selectionState: selectionState,
	inputs: inputs,
	// Toggles
	docType: docType,
	mode: mode,
	paginationState: paginationState,
	toggles: toggles,
	// Validation
	userErrors: userErrors,
	user: user,
})

export default reduceJoyce