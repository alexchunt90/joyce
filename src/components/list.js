import React from 'react'
import PropTypes from 'prop-types'

import { ChapterButton, NoteButton, TagButton, EditionButton, MediaButton } from './button'

export const DocumentList = ({docs, currentDocument, onDocumentClick, docType}) =>
	<div id='document_list' className='d-flex flex-grow-1'>
		{(docType === 'chapters' && docs.length > 0) &&
			<ChapterList chapters={docs} currentChapter={currentDocument} onChapterClick={onDocumentClick}/>
		}		
		{(docType === 'notes' && docs.length > 0) &&
			<NoteList notes={docs} currentNote={currentDocument} onNoteClick={onDocumentClick}/>
		}
		{(docType === 'tags' && docs.length > 0) &&
			<TagList tags={docs} currentTag={currentDocument} onTagClick={onDocumentClick}/>
		}
		{(docType === 'editions' && docs.length > 0) &&
			<EditionList editions={docs} currentEdition={currentDocument} onEditionClick={onDocumentClick}/>
		}		
		{(docType === 'media' && docs.length > 0) &&
			<MediaList media={docs} currentMedia={currentDocument} onMediaClick={onDocumentClick}/>
		}
	</div>

export const ChapterList = ({chapters, currentChapter, onChapterClick}) =>
	<div>
    	{chapters.map(chapter =>
			<ChapterButton key={chapter.id} currentChapter={currentChapter} chapter={chapter} onClick={()=>onChapterClick(chapter.id, 'chapters')}/>
    	)}
	</div>

export const NoteList = ({notes, currentNote, onNoteClick}) =>
	<div>
    	{notes.map(note =>
			<NoteButton key={note.id} currentNote={currentNote} note={note} onClick={()=>onNoteClick(note.id, 'notes')} />
    	)}
	</div>

export const TagList = ({tags, currentTag, onTagClick}) =>
	<div>
    	{tags.map(tag =>
			<TagButton key={tag.id} currentTag={currentTag} tag={tag} onClick={()=>onTagClick(tag.id, 'tags')} />
    	)}
	</div>

export const EditionList = ({editions, currentEdition, onEditionClick}) =>
	<div>
    	{editions.map(edition =>
			<EditionButton key={edition.id} currentEdition={currentEdition} edition={edition} onClick={()=>onEditionClick(edition.id, 'editions')} />
    	)}
	</div>


export const MediaList = ({media, currentMedia, onMediaClick}) =>
	<div>
    	{media.map(media =>
			<MediaButton key={media.id} currentMediaId={currentMedia.id} media={media} onClick={()=>onMediaClick(media.id, 'media')} />
    	)}
	</div>

DocumentList.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	chapters: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	onDocumentClick: PropTypes.func,
	docType: PropTypes.string,
}

ChapterList.propTypes = {
	chapters: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	onChapterClick: PropTypes.func,
}

NoteList.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	currentDocument: PropTypes.object,
	onNoteClick: PropTypes.func,
}

TagList.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.object),
	currentTag: PropTypes.object,
	onTagClick: PropTypes.func,
}

EditionList.propTypes = {
	editions: PropTypes.arrayOf(PropTypes.object),
	currentEdition: PropTypes.object,
	onEditionClick: PropTypes.func,
}

MediaList.propTypes = {
	media: PropTypes.arrayOf(PropTypes.object),
	currentMedia: PropTypes.object,
	onMediaClick: PropTypes.func,
}