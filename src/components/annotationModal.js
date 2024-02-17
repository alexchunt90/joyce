import React from 'react'
import { Editor } from 'draft-js'
import PropTypes from 'prop-types'

import { blockStyleFn } from '../modules/editorSettings'
import { EditorSubmitButton, EditorCancelButton } from './button'
import { ImageGroup } from './image'

const AnnotateModal = ({annotationNote, annotationNoteMedia, modalEditorState}) =>
	<div className='modal fade' id='annotation_modal' tabIndex='-1' role='dialog'>
		<div id='annotation_modal_wrapper' className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>{annotationNote.title ? annotationNote.title : ''}</h5>
			        <button id='select_annotation_modal_close' type="button" className="btn-close" data-bs-dismiss="modal">
			        </button>					
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-11 col-lg-7 offset-md-1'>
							<Editor editorState={modalEditorState} blockStyleFn={blockStyleFn} readOnly={true} />
						</div>
						{annotationNote.media_doc_ids && annotationNote.media_doc_ids.length > 0 &&
							<div className='col-lg-3 col-md-11 offset-md-1 offset-lg-0'>
								<ImageGroup media_docs={annotationNoteMedia} />
							</div>
						}
					</div>
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