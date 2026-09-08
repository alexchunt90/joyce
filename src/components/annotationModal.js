import React, { useEffect } from 'react'
import { Editor } from 'draft-js'
import PropTypes from 'prop-types'

import { blockStyleFn, blockRenderFn } from '../modules/editorSettings'
import { EditorSubmitButton, EditorCancelButton } from './button'
import { ImageGroup } from './image'
import modalControl from '../modules/modalControl'
import annotationURL from '../modules/annotationURL'

// Keeps the modal in step with the ?note= URL param from the component side:
//  - on mount, a deep link (/4?note=<id>) shows the modal, covering the case where the
//    note fetch joyceRouter started at boot has already returned before this element existed
//  - a user-initiated close (X, ESC, backdrop) is reported to the caller so the router can
//    drop ?note= from the URL; hides the router itself triggered are filtered out via modalControl
const useAnnotationModalURLSync = (onModalHidden) => {
	useEffect(() => {
		const element = document.getElementById('annotation_modal')
		if (!element || typeof onModalHidden !== 'function') {
			return undefined
		}
		if (typeof annotationURL.parseNoteParam() !== 'undefined' && !modalControl.isAnnotationModalOpen()) {
			modalControl.showAnnotationModal()
		}
		const handler = () => {
			if (!modalControl.consumeSelfInitiatedHide()) {
				onModalHidden()
			}
		}
		element.addEventListener('hidden.bs.modal', handler)
		return () => element.removeEventListener('hidden.bs.modal', handler)
	}, [onModalHidden])
}

const AnnotateModal = ({annotationNote, annotationNoteMedia, modalEditorState, onModalHidden}) => {
	useAnnotationModalURLSync(onModalHidden)
	return (
	<div className='modal fade' id='annotation_modal' tabIndex='-1' role='dialog'>
		<div className='annotation_modal_wrapper modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>{annotationNote.title ? annotationNote.title : ''}</h5>
			        <button id='select_annotation_modal_close' type="button" className="btn-close" data-bs-dismiss="modal">
			        </button>					
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-11 col-lg-7 offset-md-1'>
							<Editor editorState={modalEditorState} blockStyleFn={blockStyleFn} blockRendererFn={blockRenderFn} readOnly={true} />
						</div>
						{annotationNote.media_doc_ids && annotationNote.media_doc_ids.length > 0 &&
							<div className='col-lg-3 col-md-11 offset-md-1 offset-lg-0'>
								<ImageGroup media_docs={annotationNoteMedia} />
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	</div>
	)
}

AnnotateModal.propTypes = {
	annotationNote: PropTypes.object,
	annotationNoteMedia: PropTypes.arrayOf(PropTypes.object),
	modalEditorState: PropTypes.object,
	onModalHidden: PropTypes.func,
}

export default AnnotateModal