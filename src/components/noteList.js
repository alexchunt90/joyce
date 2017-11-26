import React from 'react'

const NoteList = ({notes, currentNote, onNoteClick}) =>
	<div>
    	{notes.map(note =>
			<a>{note.title}</a>
    	)}
	</div>

export default NoteList