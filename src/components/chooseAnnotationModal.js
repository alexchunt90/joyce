import React from 'react'
import { Editor } from 'draft-js'
import PropTypes from 'prop-types'

import { EditorSubmitButton, EditorCancelButton } from './button'
import TagColorPreview from './tagColorPreview'
import { DocumentList } from './list'
import helpers from '../modules/helpers'

const ChooseAnnotationModal = ({notes, tags, annotationNote, annotationTag, modalEditorState, onSubmitClick, selectAnnotationNote, selectAnnotationTag, clearAnnotationTag, userErrors}) =>
	<div className='modal fade' id='annotate_modal' tabIndex='-1' role='dialog'>
		<div className='modal-dialog modal-lg' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title' id='exampleModalLabel'>Select a note</h5>
			        <button id='select_annotation_modal_close' type="button" className="btn-close" data-bs-dismiss="modal">
			        </button>
				</div>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-md-3'>
							<DocumentList docs={notes} currentDocument={annotationNote} onDocumentClick={selectAnnotationNote} docType={'notes'}/>
						</div>
						<div className='col-md-8 offset-md-1'>
							<Editor editorState={modalEditorState} readOnly={true} />
						</div>
					</div>
					<div className='row'>
						<div id='annotation_tag_dropdown' className='col-md-2'>
							<button className={annotationNote.id ? 'btn btn-primary dropdown-toggle caret-off' : 'btn btn-primary dropdown-toggle caret-off disabled'} data-bs-toggle='dropdown' type='button'><i className='fas fa-chevron-down'></i>Tags</button>
							<div className='dropdown-menu'>
								{tags.map(tag =>
						      		<div key={tag.id} className='dropdown-item' onClick={()=>selectAnnotationTag(tag)}>
						      			<TagColorPreview color={tag.color}/>
						      			<a className='select_annotation_tag'>{tag.title}</a>
						      		</div>
								)}
						    </div>
					    </div>
					    <div id='annotation_tag_preview' className='col-md-8 offset-md-1'>
					    	{annotationTag.id &&
					    		<div id='selected_annotation_tag'>
					    			<TagColorPreview color={annotationTag.color}/> 
					    			{annotationTag.title}
					    			<a id='clear_anntation_tag' onClick={clearAnnotationTag}>
				    					<i className='fas fa-times'></i>
					    			</a>
					    		</div>
					    	}
					    </div>				
					</div>
					<div className='row'>
						<div id='user_errors' className='col-md-12'>
							{userErrors.map(error =>
								<div key={error} className='user_error_message'>{error}</div>
							)}
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
	annotationTag: PropTypes.object,
	onSubmitClick: PropTypes.func,
	selectAnnotationNote: PropTypes.func,
	selectAnnotationTag: PropTypes.func,
}

export default ChooseAnnotationModal