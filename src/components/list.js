import React from 'react'
import { ChapterButton, NoteButton } from './button'

export const ChapterList = ({chapters, currentChapter, onChapterClick}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} currentChapter={currentChapter} chapter={chapter} onClick={onChapterClick}/>
    	)}
	</div>

export const NoteList = ({notes, currentNote, onNoteClick}) =>
	<div>
    	{notes.map(note =>
			<NoteButton key={note.id} currentNote={currentNote} note={note} onClick={onNoteClick} />
    	)}
	</div>