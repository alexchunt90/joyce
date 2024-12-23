import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import api from '../modules/api'

const NoteIndexSummary = ({notes}) => {
	const alphabetString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const alphabetArray = alphabetString.split('')
	
	let notesIndexArray = []
	for (const letter of alphabetString) {
		const indexMap = new Map()
		indexMap.set('letter', letter)
		indexMap.set('docs', [])
		notesIndexArray.push(indexMap)
	}
	for (const note of notes) {
		const title = note.title || ''
		const titleSansArticles = title.replace('The ', '').replace('A ', '').replace('An ', '')
		const titleStartingLetter = titleSansArticles.substring(0,1).toUpperCase()
		const titleLetterIndexInt = alphabetString.indexOf(titleStartingLetter)

		if (titleLetterIndexInt >= 0) {
			const noteIndexMap = notesIndexArray[titleLetterIndexInt]
			const docsArray = noteIndexMap.get('docs')
			const newDocsArray = [...docsArray, note]
			noteIndexMap.set('docs', newDocsArray)
		}
	}

	// useEffect(() => {
	// 	console.log(notesIndexArray)
	// }, [])

	return (
		<div className='row note_index_container'>
			<div className='col-1'>
				{alphabetArray.map(a =>
					<div className='index_letter' key={a}>
						<a onClick={()=>{document.getElementById('header-' + a).scrollIntoView()}}>
							{a}
						</a>
					</div>
				)}
			</div>
			<div className='col-12 note_index_list'>
				{notesIndexArray.map(indexLetter =>
					<div key={indexLetter.get('letter')}>
						<h3  className='index_header' id={'header-' + indexLetter.get('letter')}>{indexLetter.get('letter')}</h3>
						<div>
							{indexLetter.get('docs').map(note => 
								<p key={note.id} className='mb-0'>
									<Link to={'/notes/' + note.id}>
										{note.title}
									</Link>
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default NoteIndexSummary