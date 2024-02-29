import React from 'react'
import { useState, useEffect } from 'react'
import { Editor } from 'draft-js'

import api from '../modules/api'
import {stateFromHTML} from '../modules/draftConversion'
import {readerDecorator} from '../modules/editorSettings'
import editorConstructor from '../modules/editorConstructor'

const ColorCodingSummary = ({tags}) => {

	return (
		<div className='row'>
			<div className='col'>
				{tags.map(tag =>
					<TagSummary tag={tag} key={tag.id}/>
				)}
			</div>
		</div>
	)
}

const TagSummary = ({tag}) => {
	const blankEditor = editorConstructor.returnNewEditorState(readerDecorator)
	const [editorState, setEditorState] = useState(blankEditor)


	useEffect(() => {
		api.HTTPGetDocumentText(tag.id, 'tags').then(response => {
			const contentState = stateFromHTML(response.data.html_source)
			const editorState = editorConstructor.returnEditorStateFromContentState(contentState)
			setEditorState(editorState)
		}).catch(error => console.log(error))
	}, [])

	return (
		<div>
			<h4 className='text-start' style={{color: '#' + tag.color}}>{tag.title}</h4>
			<Editor editorState={editorState} readOnly={true}/>
		</div>
	)
}

export default ColorCodingSummary