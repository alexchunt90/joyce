import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import api from '../modules/api'
import {LATEST_TALLY} from '../config'

const NoteTallySummary = ({noteCount}) => {
	const [tallyArray, setTally] = useState(LATEST_TALLY)

	useEffect(() => {
		api.HTTPGetChapterNoteTally().then(response => {
			setTally(response.data)
		}).catch(error => console.log(error))
	}, [])

	return (
		<div className='col-8'>
			<div className='row mt-2'>
				<div className='col'>
				<p>Many notes are linked to passages in multiple chapters. The total number of unique notes to which all these highlighted passages link, so far, is {noteCount}. For a complete list, see the alphabetical <Link to='/notes/index'>Index of Titles</Link></p>
				</div>
			</div>
			<div className='row'>
				<div className='col-5 offset-2'>
					{tallyArray.map(chap =>
						<p key={chap.title} className='mb-0'>{chap.title}</p>
					)}
				</div>
				<div className='col-5'>
					{tallyArray.map(chap =>
						<p key={chap.title} className='mb-0'>{chap.count}</p>
					)}			
				</div>
			</div>
		</div>
	)
}

export default NoteTallySummary