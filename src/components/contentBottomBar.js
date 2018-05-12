import React from 'react'
import PropTypes from 'prop-types'

import { EditorCancelButton, EditorSubmitButton } from '../components/button'

export const EditModeBottomBar = ({cancelEdit, onSubmitClick}) =>
	<div className='row'>
		<div className='col-md-5'>
			<EditorCancelButton onClick={()=>cancelEdit()}/>
		</div>
		<div className='col-md-5 offset-md-2'>
			<EditorSubmitButton onClick={onSubmitClick} />
		</div>
	</div>

EditModeBottomBar.propTypes = {
	cancelEdit: PropTypes.func,
	onSubmitClick: PropTypes.func,
}