import React from 'react'

import { MediaList } from './list'

// Attempting to move selected notes to the top of the media array
// const sortMediaArray = (mediaArray, selectedMediaArray) => {
// 	let newArray = mediaArray
// 	for (const m in newArray) {
// 		if (selectedMediaArray.indexOf(m.id) >= 0) {
// 			newArray.filter(n => n.id !== m.id)
// 			newArray.unshift(m)
// 		}
// 	}
// 	return newArray
// }

const NoteMediaPicker = ({media, selectedMedia, onMediaCheckboxClick}) =>
	<div id='note_media_picker' className='row'>
		<div className='col-12'>
			<div className='btn-group'>
				<button className='btn btn-secondary dropdown-toggle' type='button' data-toggle='dropdown'>
					Select Media
				</button>
				<div className='dropdown-menu note-picker-dropdown'>
					{media.map(media =>
						<div key={media.id} className='row'>
							<div className='col-2'>
								<input type='checkbox' onClick={()=>onMediaCheckboxClick(media.id)} value={media.id} onChange={()=>{selectedMedia.indexOf(media.id) >= 0 ? true : false}} />
							</div>
							<div className='col-6'>
								{media.title}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	</div>

export default NoteMediaPicker