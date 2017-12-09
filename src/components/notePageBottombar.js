import React from 'react'
import { ReaderAnnotateButton, ReaderEditButton, EditorCancelButton, EditorSubmitButton } from '../components/button'

export const ReaderBottombar = ({setEditMode}) =>
	<div className='row'>
		<div className='col-md-5'>
			<ReaderAnnotateButton />
		</div>
		<div className='col-md-5 offset-md-2'>
			<ReaderEditButton onClick={()=>setEditMode()} />
		</div>
	</div>

export const EditorBottombar = ({cancelEdit}) =>
	<div className='row'>
		<div className='col-md-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<EditorSubmitButton />
		</div>
	</div>