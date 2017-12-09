import React from 'react'
import { ReaderAnnotateButton, ReaderEditButton, EditorCancelButton, EditorSubmitButton } from '../components/button'

export const ReadModeBottomBar = ({setEditMode}) =>
	<div className='row'>
		<div className='col-md-5'>
			<ReaderAnnotateButton />
		</div>
		<div className='col-md-5 offset-md-2'>
			<ReaderEditButton onClick={()=>setEditMode()} />
		</div>
	</div>

export const EditModeBottomBar = ({cancelEdit, onSubmitClick}) =>
	<div className='row'>
		<div className='col-md-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<EditorSubmitButton onSubmitClick={onSubmitClick} />
		</div>
	</div>