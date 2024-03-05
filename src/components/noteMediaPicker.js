import React from 'react'
import { useSelector } from 'react-redux'

import { MediaList } from './list'
import FilterInput from './filterInput'

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

export const NoteMediaDropdown = ({media, selectedMedia, onMediaCheckboxClick}) => {
	const filterInputText = useSelector((state) => state.inputs.filterInput).toLowerCase()
	let filteredMediaArray = sortMediaArray(media, selectedMedia)

	if (filterInputText !== '') {			
		filteredMediaArray = filteredMediaArray.filter((media) => {
			if (selectedMedia.indexOf(media.id) > 0) {
				return true
			} else if (typeof media.title === 'string') {
				const mediaTitle = media.title.toLowerCase()
				return mediaTitle.includes(filterInputText)
			} else {return false}
		})
	}	

	return (
		<div className='dropdown-menu note-picker-dropdown'>
			<FilterInput />
			{filteredMediaArray.map(media =>
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
	)
}


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