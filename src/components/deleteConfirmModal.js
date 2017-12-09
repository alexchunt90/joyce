import React from 'react'

import { EditorDeleteButton } from './button'

const DeleteConfirmModal = ({onDeleteClick}) =>
	<div className="modal fade" id="delete_confirm_modal" tabIndex="-1" role="dialog">
		<div className="modal-dialog" role="document">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="exampleModalLabel">Delete this document?</h5>
				</div>
				<div className="modal-body">
					Deleted documents are gone forever. Choose wisely.
				</div>
				<div className="modal-footer">
					<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					<EditorDeleteButton onClick={onDeleteClick} />
				</div>
			</div>
		</div>
	</div>

export default DeleteConfirmModal