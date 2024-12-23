import React from 'react'
import { connect } from 'react-redux'

import { TextEditor } from '../components/textEditor'
import { EditorTitleContentBlock, EditorTopBarContentBlock, EditorTextContentBlock, EditorBottomBarContentBlock, EditorAttributeContentBlock } from '../components/editorContentBlock'
import { EditorEditModeRichTextOptions, EditorSubmitOptions } from '../components/editorOptionBlock'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import DocumentTitleInput from '../components/documentTitleInput'
import ExternalURLInput from '../components/externalURLInput'
import TagColorPicker from '../components/tagColorPicker'
import EditionYearInput from '../components/editionYearInput'
import {NoteMediaPicker} from '../components/noteMediaPicker'
import MediaUploadInput from '../components/mediaUploadInput'
import LoadingSpinner from '../components/loadingSpinner'

const EditorEditMode = ({
	media,
	currentDocument,
	docType,
	editorState,
	inputs,
	userErrors,
	handleKeyCommand,
	onChangeEditorState,
	onDocumentTitleChange,
	onDocumentNumberChange,
	onEditionYearInputChange,
	onColorPickerInputChange,
	onColorSwatchClick,
	onClearLoadedMedia,
	onMediaInputChange,
	onURLInputChange,
	onNotePickerMediaCheckboxClick,
	onInlineMediaCheckboxClick,
	cancelEdit,
	onSubmitClick,
	onToolButtonClick,
	onCustomClassToggle,
}) =>
	<div id='editor_edit_mode'  className='editor_wrapper d-flex flex-column'>
		{/* Doc Title */}
		<EditorTitleContentBlock>
			<DocumentTitleInput
				titleInput={inputs.documentTitle}
				numberInput={inputs.documentNumber}
				onTitleChange={onDocumentTitleChange}
				onNumberChange={onDocumentNumberChange}
				docType={docType}
			/>
		</EditorTitleContentBlock>
		{/* Topbar with rich text options */}
		<EditorTopBarContentBlock>
			<EditorEditModeRichTextOptions 
				editorState={editorState}
				media={media}
				onToolButtonClick={onToolButtonClick} 
				disabled={!currentDocument.id ? true : false}
				onCustomClassToggle={onCustomClassToggle}
				onMediaCheckboxClick={onInlineMediaCheckboxClick}
			/>
		</EditorTopBarContentBlock>
		<EditorTextContentBlock>
			<TextEditor 
				editorState={editorState}
				docType={docType}
				handleKeyCommand={handleKeyCommand} 
				onChange={onChangeEditorState} 
			/>
		</EditorTextContentBlock>
		{/* Dropdown select for attaching media or tags */}
		<EditorAttributeContentBlock>
			{docType === 'notes' &&
				<NoteMediaPicker 
					media={media} 
					selectedMedia={inputs.noteMediaSelection}
					onMediaCheckboxClick={onNotePickerMediaCheckboxClick}
				/>
			}
			{docType === 'tags' &&
				<TagColorPicker 
					input={inputs.colorPicker} 
					onChange={onColorPickerInputChange} 
					onColorSwatchClick={onColorSwatchClick}
				/>
			}
			{docType === 'editions' &&
				<EditionYearInput 
					input={inputs.editionYear} 
					onChange={onEditionYearInputChange} 
				/>
			}
			{docType === 'media' && 
				<div className='row'>
					<p>Please enter a valid YouTube embed URL <i>with https</i>, e.g. https://www.youtube.com/embed/dQw4w9WgXcQ</p>
					<ExternalURLInput externalURLInput={inputs.externalURL} onInputChange={onURLInputChange} disabled={inputs.uploadFile ? true : false}/>
				</div>
			}
			{docType === 'media' && 
				<div className='row'>
					<p> - OR - </p>
				</div>
			}			
			{docType === 'media' && inputs.uploadFile &&
				<div className='row'>
					<div className='col-8'>File ready to upload.</div>					
					<div className='col-2 offset-2'>
						<button type='button' onClick={onClearLoadedMedia} className='btn btn-outline-info btn-sm'>
							<i className={'fas fa-trash-alt'}></i>
						</button>
					</div>
				</div>
			}
			{docType === 'media' && !inputs.uploadFile &&
				<MediaUploadInput input={inputs.uploadFile} onChange={onMediaInputChange} currentDocument={currentDocument} disabled={inputs.externalURL === '' ? false : true}/>
			}					
		</EditorAttributeContentBlock>
		{/* Cancel and Submit buttons */}
		<EditorBottomBarContentBlock>
			<EditorSubmitOptions 
				cancelEdit={cancelEdit} 
				onSubmitClick={()=>onSubmitClick(currentDocument, editorState, inputs, docType)} 
			/>
		{/* Display errors to user */}
		</EditorBottomBarContentBlock>
		<div id='user_errors'>
			{userErrors.map(error =>
				<div key={error} className='user_error_message'>{error}</div>
			)}
		</div>		
	</div>

const mapStateToProps = (state, props) => {
	return {
		media: state.media,
		currentDocument: state.currentDocument,
		docType: state.docType,
		editorState: state.editorState,
		inputs: state.inputs,
		userErrors: state.userErrors,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onChangeEditorState: editorState => {
			dispatch(actions.updateEditorState(editorState))
		},
		onDocumentTitleChange: input => {
			dispatch(actions.updateDocumentTitleInput(input))
		},
		onDocumentNumberChange: input => {
			dispatch(actions.updateDocumentNumberInput(input))
		},	
		onEditionYearInputChange: input => {
			dispatch(actions.updateEditionYearInput(input))
		},
		onColorPickerInputChange: input => {
			dispatch(actions.updateColorPickerInput(input))
		},
		handleKeyCommand: (command, editorState) => {
			dispatch(actions.handleEditorKeyCommand(editorState, command))
		},
		onMediaInputChange: input => {
			dispatch(actions.updateMediaInput(input))
		},
		onURLInputChange: input => {
			dispatch(actions.updateExternalURLInput(input))
		},		
		onNotePickerMediaCheckboxClick: id => {
			dispatch(actions.toggleMediaCheckbox(id))
		},
		onClearLoadedMedia: () => {
			dispatch(actions.clearLoadedMedia())
		},
		cancelEdit: () => {
			dispatch(actions.cancelEdit())
		},
		onColorSwatchClick: (color) => {
			dispatch(actions.selectColorSwatch(color))
		},
		onToolButtonClick: (editorState, style) => {
			dispatch(actions.applyInlineStyles(editorState, style))
		},
		onCustomClassToggle: (editorState, className) => {
			dispatch(actions.toggleCustomClass(editorState, className))
		},
		onInlineMediaCheckboxClick: (editorState, media) => {
			dispatch(actions.addInlineImage(editorState, media))
		},
		onSubmitClick: (currentDocument, editorState, inputs, docType) => {
			dispatch(actions.submitDocumentEdit(currentDocument, editorState, inputs, docType))
		},
	}
}

const EditorEditModeContainer = connect(mapStateToProps, mapDispatchToProps)(EditorEditMode)	

export default EditorEditModeContainer