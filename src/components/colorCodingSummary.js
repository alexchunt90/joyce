import React from 'react'
import { useState, useEffect } from 'react'

import api from '../modules/api'
import {TextEditorReadOnly} from './textEditor'
import {stateFromHTML} from '../modules/draftConversion'
import {returnNewEditorState, returnEditorStateFromContentState, readerDecorator} from '../modules/editorSettings'

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
	const blankEditor = returnNewEditorState(readerDecorator)
	const [editorState, setEditorState] = useState(blankEditor)


	useEffect(() => {
		api.HTTPGetDocumentText(tag.id, 'tags').then(response => {
			const contentState = stateFromHTML(response.data.html_source)
			console.log(contentState)
			const editorState = returnEditorStateFromContentState(contentState)
			console.log(editorState)
			setEditorState(editorState)
		}).catch(error => console.log(error))
	}, [])

	return (
		<div>
			<h4 className='text-start' style={{color: '#' + tag.color}}>{tag.title}</h4>
			<TextEditorReadOnly editorState={editorState}/>
		</div>
	)
}

export default ColorCodingSummary