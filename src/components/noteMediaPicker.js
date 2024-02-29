import React from 'react'

import { MediaList } from './list'

// Move selected notes to the top of the media array
const sortMediaArray = (mediaArray, selectedMediaArray) => {
	let newArray = mediaArray
	for (const m of newArray) {
		if (selectedMediaArray.indexOf(m.id) >= 0) {
			newArray = newArray.filter(n => n.id !== m.id)
			newArray.unshift(m)
		}
	}
	return newArray
}

export const NoteMediaDropdown = ({media, selectedMedia, onMediaCheckboxClick}) =>
	<div className='dropdown-menu note-picker-dropdown'>
		{sortMediaArray(media, selectedMedia).map(media =>
			<div key={media.id} className='row'>
				<div className='col-6'>
					<input 
						type='checkbox' 
						onClick={()=>onMediaCheckboxClick(media.id)} 
						value={media.id} 
						checked={selectedMedia.indexOf(media.id) >= 0 ? true : false}
						onChange={()=>{selectedMedia.indexOf(media.id) >= 0 ? true : false}} />
					 {media.title}
				</div>
			</div>
		)}
	</div>


export const NoteMediaPicker = ({media, selectedMedia, onMediaCheckboxClick}) =>
	<div id='note_media_picker' className='row'>
		<div className='col-12'>
			<div className='btn-group'>
				<button className='btn btn-secondary dropdown-toggle' type='button' data-bs-toggle='dropdown'>
					Select Media
				</button>
				<NoteMediaDropdown media={media} selectedMedia={selectedMedia} onMediaCheckboxClick={onMediaCheckboxClick} />
			</div>
		</div>
	</div>