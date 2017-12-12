import React from 'react'

import { EditorSubmitButton, EditorCancelButton } from './button'
import { DocumentList } from './list'

const AnnotateModal = ({annotationNote}) =>
	<div className='modal fade' id='annotation_modal' tabIndex='-1' role='dialog'>
		<div className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>{annotationNote.title ? annotationNote.title : ''}</h5>
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-10 offset-md-1'>
							<div dangerouslySetInnerHTML={{__html: annotationNote.text}} />
						</div>
					</div>
				</div>
				<div className='modal-footer'>
					<EditorCancelButton />
				</div>
			</div>
		</div>
	</div>

export default AnnotateModal