import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import TagColorPreview from './tagColorPreview'

export const AnnotationDocumentList = ({docs, currentDocument, docType, onDocumentClick}) =>
	<div id='document_list' className='d-flex flex-grow-1'>
		<div>
			{docType === 'notes' && docs.length > 0 && docs.map(note =>
				<div className ='note_button' key={note.id}>
					<button onClick={()=>onDocumentClick(note.id)} className={currentDocument.id === note.id ? 'btn btn-info' : 'btn btn-outline-info inactive_button'}>
						{note.title}
					</button>
				</div>
			)}
		</div>
	</div>

export const DocumentList = ({docs, currentDocument, docType, basePath}) =>
	<div id='document_list' className='d-flex flex-grow-1'>
		{(docType === 'chapters' && docs.length > 0) &&
			<ChapterList chapters={docs} currentChapter={currentDocument} basePath={basePath}/>
		}		
		{(docType === 'notes' && docs.length > 0) &&
			<NoteList notes={docs} currentNote={currentDocument} basePath={basePath}/>
		}
		{(docType === 'info' && docs.length > 0) &&
			<InfoList info={docs} currentInfo={currentDocument} basePath={basePath}/>
		}
		{(docType === 'tags' && docs.length > 0) &&
			<TagList tags={docs} currentTag={currentDocument} basePath={basePath}/>
		}
		{(docType === 'editions' && docs.length > 0) &&
			<EditionList editions={docs} currentEdition={currentDocument} basePath={basePath}/>
		}		
		{(docType === 'media' && docs.length > 0) &&
			<MediaList media={docs} currentMedia={currentDocument} basePath={basePath}/>
		}
	</div>

export const ChapterList = ({chapters, currentChapter, onChapterClick, basePath='/'}) =>
	<div>
    	{chapters.map(chapter =>
			<div className ='chapter_button text-center' key={chapter.id}>
				<Link to={basePath + chapter.number} className={currentChapter.id === chapter.id ? 'btn btn-primary' : 'btn btn-outline-primary inactive_button'}>
					{chapter.title}
				</Link>
			</div>    		
    	)}
	</div>

export const NoteList = ({notes, currentNote, onNoteClick, basePath='/'}) =>
	<div>
    	{notes.map(note =>
			<div className ='note_button' key={note.id}>
				<Link to={basePath + 'notes/' + note.id} className={currentNote.id === note.id ? 'btn btn-primary' : 'btn btn-outline-info inactive_button'}>
					{note.title}
				</Link>
			</div>
    	)}
	</div>

export const InfoList = ({info, currentInfo, onInfoClick, basePath='/'}) =>
	<div>
    	{info.map(infoDoc =>
    		<div className='info_button' key={infoDoc.id}>
    			<Link to={basePath + 'info/' + infoDoc.id} className={currentInfo.id === infoDoc.id ? 'btn btn-primary' : 'btn btn-outline-info inactive_button'}>
    				{infoDoc.title}
				</Link>
			</div>
    	)}
	</div>

export const TagList = ({tags, currentTag, onTagClick, basePath='/'}) =>
	<div>
    	{tags.map(tag =>
			<div className ='tag_button' key={tag.id}>
				<Link to={basePath + 'tags/' + tag.id} className={currentTag.id === tag.id ? 'btn btn-primary' : 'btn btn-outline-info inactive_button'}>
					<TagColorPreview color={tag.color}/>
					{tag.title}
				</Link>
			</div>			
    	)}
	</div>

export const EditionList = ({editions, currentEdition, onEditionClick, basePath='/'}) =>
	<div>
    	{editions.map(edition =>
			<div className ='edition_button' key={edition.id}>
				<Link to={basePath + 'editions/' + edition.id} className={currentEdition.id === edition.id ? 'btn btn-primary' : 'btn btn-outline-info inactive_button'}>
					{edition.title} ({edition.year})
				</Link>
			</div>	
    	)}
	</div>


export const MediaList = ({media, currentMedia, onMediaClick, basePath='/'}) =>
	<div>
    	{media.map(media =>
			<div className ='media_button'>
				<Link to={basePath + 'media/' + media.id} className={currentMedia.id === media.id ? 'btn btn-primary' : 'btn btn-outline-info inactive_button'}>
					{media.title}
				</Link>
			</div>
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