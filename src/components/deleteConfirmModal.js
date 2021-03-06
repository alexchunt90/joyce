import React from 'react'
import PropTypes from 'prop-types'

import { EditorDeleteButton, EditorCancelButton } from './button'

const DeleteConfirmModal = ({onDeleteConfirm}) =>
	<div className='modal fade' id='delete_confirm_modal' tabIndex='-1' role='dialog'>
		<div className='modal-dialog' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>Delete this document?</h5>
				</div>
				<div className='modal-body'>
					Deleted documents are gone forever. Choose wisely.
				</div>
				<div className='modal-footer'>
					<EditorCancelButton />
					<EditorDeleteButton onClick={onDeleteConfirm} />
				</div>
			</div>
		</div>
	</div>

DeleteConfirmModal.propTypes = {
	onDeleteConfirm: PropTypes.func,
}	

export default DeleteConfirmModal