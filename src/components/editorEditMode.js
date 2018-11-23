import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import { EditModeTopBar }  from '../components/contentTopBar'
import { EditModeBottomBar } from '../components/contentBottomBar'
import TagColorPicker from '../components/tagColorPicker'
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
	colorPickerInput,
	documentTitleInput,
	onDocumentTitleChange,
	onColorPickerInputChange,
	onColorSwatchClick,
	userErrors,
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
		<div id='editor_content' className={docType === 'tags' ? 'short_editor' : 'tall_editor'}>
			<Editor 
				editorState={editorState} 
				handleKeyCommand={handleKeyCommand}
				onChange={onChangeEditorState}
			/>	
		</div>
		<div id='editor_attributes'>
			{docType === 'tags' &&
				<TagColorPicker colorPickerInput={colorPickerInput} onChange={onColorPickerInputChange} onColorSwatchClick={onColorSwatchClick}/>
			}
		</div>		
		<div id='editor_bottombar'>
			<EditModeBottomBar cancelEdit={cancelEdit} onSubmitClick={onSubmitClick} />
		</div>
		<div id='user_errors'>
			{userErrors.map(error =>
				<div key={error} className='user_error_message'>{error}</div>
			)}
		</div>
	</div>

export default EditorEditMode