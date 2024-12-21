import React from 'react'
import PropTypes from 'prop-types'

const AnnotatorNewButton = ({onClick, disabled}) =>
	<button type='button' onClick={onClick} disabled={disabled} className='btn btn-info btn-sm' data-bs-toggle='modal' data-bs-target='#annotate_modal'>
		New Annotation
		<i className='fas fa_inline fa-link'></i>
	</button>

const AnnotatorNewURLButton = ({onClick, disabled}) =>
	<button type='button' onClick={onClick} disabled={disabled} className='btn btn-info btn-sm' data-bs-toggle='modal' data-bs-target='#external_url_modal'>
		New External Link
		<i className='fas fa_inline fa-arrow-up-right-from-square'></i>
	</button>	

const AnnotatorRemoveButton = ({onClick, disabled}) =>
	<button type='button' onClick={onClick} disabled={disabled} className='btn btn-secondary btn-sm'>
		Remove Annotation
		<i className='fas fa_inline fa-unlink'></i>		
	</button>	

const EditorAnnotateOptions = ({onNewAnnotationClick, onRemoveAnnotationClick, addDisabled, removeDisabled}) =>
	<div className='row'>
		<div className='annotate_option_button col-4'>
			<AnnotatorNewButton onClick={onNewAnnotationClick} disabled={addDisabled}/>
		</div>
		<div className='annotate_option_button col-4'>
			<AnnotatorNewURLButton onClick={onNewAnnotationClick} disabled={addDisabled} />
		</div>			
		<div className='annotate_option_button col-4'>
			<AnnotatorRemoveButton onClick={onRemoveAnnotationClick} disabled={removeDisabled} />
		</div>	
	</div>

export default EditorAnnotateOptions

AnnotatorNewButton.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
}

AnnotatorRemoveButton.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
}