import React from 'react'
import { Editor } from 'draft-js'
import PropTypes from 'prop-types'

import { EditorSubmitButton } from './button'
import { ImageGroup } from './image'
import ExternalURLInput from './externalURLInput'

const ExternalURLModal = ({externalURLInput, onInputChange, onSubmitClick}) =>
	<div className='modal fade' id='external_url_modal' tabIndex='-1' role='dialog'>
		<div id='url_modal_wrapper' className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title'>Enter a URL</h5>
			        <button type="button" className="btn-close" data-bs-dismiss="modal">
			        </button>			
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-12'>
							This input isn't validated, so be sure to check it's a valid link and starts with http:// or https://
						</div>
					</div>		
					<div className='row'>
						<ExternalURLInput externalURLInput={externalURLInput} onInputChange={onInputChange} />
					</div>
				</div>
				<div className='modal-footer'>
					<EditorSubmitButton onClick={onSubmitClick} />
				</div>				
			</div>
		</div>
	</div>

export default ExternalURLModal