import React from 'react'
import { useState, useEffect } from 'react'

import api from '../modules/api'
import {LATEST_TALLY} from '../config'

const NoteTallySummary = () => {
	const [tallyArray, setTally] = useState(LATEST_TALLY)

	useEffect(() => {
		api.HTTPGetChapterNoteTally().then(response => {
			setTally(response.data)
		}).catch(error => console.log(error))
	}, [])

	return (
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
	)
}

export default NoteTallySummary