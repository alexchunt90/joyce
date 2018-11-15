import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import { EditModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const EditorEditMode = ({
	currentDocument,
	editorState,
	docType,
	loadingToggle,
	handleKeyCommand,
	onChangeEditorState,
	onToolButtonClick,
	setMode,
	cancelEdit,
	onSubmitClick,
	documentTitleInput,
	onDocumentTitleChange
}) =>
	<div>
		<div id='editor_metadata'>
			{loadingToggle === true &&
				<LoadingSpinner />
			}
			<input type='text' value={documentTitleInput} onChange={onDocumentTitleChange}/>
		</div>
		<div id='editor_topbar'>
			<EditModeTopBar 
				editorState={editorState}
				onToolButtonClick={onToolButtonClick}
				disabled={!currentDocument.id ? true : false}
			/>
		</div>	
		<div id='editor_content'>
			<Editor 
				editorState={editorState} 
				handleKeyCommand={handleKeyCommand} 
				onChange={onChangeEditorState}
			/>	
		</div>
		<div id='editor_bottombar'>
			<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={onSubmitClick} />
		</div>
	</div>

export default EditorEditMode