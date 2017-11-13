import React from 'react'
import { glyphiconPlusSign } from '../assets'

const NewChapterButton = () =>
	<div>
		<div id="highlight_button" className="text-center">
			<button className='btn btn-outline-success btn-lg'>
				New Chapter <img src={glyphiconPlusSign} />
			</button>
		</div>
	</div>	

export default NewChapterButton