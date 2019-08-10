import React from 'react'

import { MediaList } from './list'

const NoteMediaPicker = ({media}) =>
	<div id='note_media_picker' className='row'>
		<div className='col-12'>
			<div className="btn-group">
				<button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
					Select Media
				</button>
				<div className="dropdown-menu">
					{media.map(media =>
						<div key={media.id}>
							<input type="checkbox" />
							<div>{media.title}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	</div>

export default NoteMediaPicker