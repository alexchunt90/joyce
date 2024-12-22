import React from 'react'

const ExternalURLInput = ({externalURLInput, onInputChange, disabled=false}) =>
	<div className='url_input col-md-12'>
		<input value={externalURLInput} onChange={onInputChange} type='text' className='form-control' placeholder='External URL' disabled={disabled}/>
	</div>

export default ExternalURLInput