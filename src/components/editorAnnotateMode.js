import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import { ReadModeTopBar, EditModeTopBar, AnnotateModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const EditorAnnotateMode = ({
	currentDocument,
	editorState,
	docType,
	toggles,
	onChangeEditorState,
	onNewAnnotationClick,
	annotateKeyBindings,
	onRemoveAnnotationClick,
	cancelEdit,
	onSubmitClick,
}) =>
	<div id='editor_annotate_mode'  className='editor_wrapper'>
		<div id='editor_metadata'>
			{toggles.loading === true &&
				<LoadingSpinner />
			}
			<DocumentTitle docType={docType} currentDocument={currentDocument} />
		</div>
		<div id='editor_topbar' className='annotate_mode'>
			<AnnotateModeTopBar 
				onNewAnnotationClick={onNewAnnotationClick}
				onRemoveAnnotationClick={onRemoveAnnotationClick}
				addDisabled={editorState.getSelection().isCollapsed() ? true : false}
				removeDisabled={(editorState.getSelection().isCollapsed() ) ? true : false}
			/>
		</div>	
		<div id='editor_content' className={'annotate_mode ' + docType}>
			<Editor editorState={editorState} onChange={onChangeEditorState} keyBindingFn={annotateKeyBindings} />
		</div>
		<div id='editor_bottombar'>
			<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={onSubmitClick} />
		</div>
	</div>

export default EditorAnnotateMode