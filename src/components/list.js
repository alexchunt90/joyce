import React from 'react'
import { ChapterButton, NoteButton } from './button'

export const DocumentList = ({notes, chapters, currentDocument, onDocumentClick, path, docType}) =>
	<div id='document_list'>
		{(docType === 'chapters' && chapters.length > 0) &&
			<ChapterList chapters={chapters} currentChapter={currentDocument} path={path}/>
		}		
		{(docType === 'notes' && notes.length > 0) &&
			<NoteList notes={notes} currentNote={currentDocument} onNoteClick={onDocumentClick}/>
		}
	</div>

export const ChapterList = ({chapters, currentChapter, path}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} currentChapter={currentChapter} chapter={chapter} path={path}/>
    	)}
	</div>

export const NoteList = ({notes, currentNote, onNoteClick}) =>
	<div>
    	{notes.map(note =>
			<NoteButton key={note.id} currentNote={currentNote} note={note} onClick={()=>onNoteClick(note.id, 'notes')} />
    	)}
	</div>