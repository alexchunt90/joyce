import React from 'react'
import PropTypes from 'prop-types'

import { EditorSubmitButton, EditorCancelButton } from './button'
import { DocumentList } from './list'

const ChooseAnnotationModal = ({notes, annotationNote, onSubmitClick, selectAnnotationNote}) =>
	<div className='modal fade' id='annotate_modal' tabIndex='-1' role='dialog'>
		<div className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>Select a note</h5>
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-3'>
							<DocumentList notes={notes} currentDocument={annotationNote} onDocumentClick={selectAnnotationNote} docType={'notes'}/>
						</div>
						<div className='col-md-8 offset-md-1'>
							<div dangerouslySetInnerHTML={{__html: annotationNote.text}} />
						</div>
					</div>
				</div>
				<div className='modal-footer'>
					<EditorCancelButton />
					<EditorSubmitButton onClick={onSubmitClick} />
				</div>
			</div>
		</div>
	</div>

ChooseAnnotationModal.propTypes = {
	notes: PropTypes.arrayOf(PropTypes.object),
	annotationNote: PropTypes.object,
	onSubmitClick: PropTypes.func,
	selectAnnotationNote: PropTypes.func,
}

export default ChooseAnnotationModal