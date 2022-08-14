import React from 'react'
import { Editor } from 'draft-js'
import PropTypes from 'prop-types'

import { EditorSubmitButton, EditorCancelButton } from './button'
import { DocumentList } from './list'
import { ImageGroup } from './image'

const AnnotateModal = ({annotationNote, annotationNoteMedia, modalEditorState}) =>
	<div className='modal fade' id='annotation_modal' tabIndex='-1' role='dialog'>
		<div className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>{annotationNote.title ? annotationNote.title : ''}</h5>
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-10 offset-md-1'>
							<Editor editorState={modalEditorState} readOnly={true} />
						</div>
					</div>
					{annotationNote.media_doc_ids && annotationNote.media_doc_ids.length > 0 &&
						<div className='row'>
							<div className='col-md-10 offset-md-1'>
								<ImageGroup media_docs={annotationNoteMedia} />
							</div>
						</div>						
					}			
				</div>
				<div className='modal-footer'>
					<EditorCancelButton />
				</div>
			</div>
		</div>
	</div>

AnnotateModal.propTypes = {
	annotationNote: PropTypes.object,
	annotationNoteMedia: PropTypes.arrayOf(PropTypes.object)
}

export default AnnotateModal