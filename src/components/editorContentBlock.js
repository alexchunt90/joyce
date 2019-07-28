import React from 'react'
import { ReaderAnnotateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, AnnotatorNewButton, AnnotatorRemoveButton, EditorCancelButton, EditorSubmitButton} from './button'

export const EditorTitleContentBlock = (props) =>
	<div id='editor_title_block' className='col-md-12'>
		{props.children}
	</div>

export const EditorTopBarContentBlock = (props) =>
	<div id='editor_top_bar_block' className='col-md-12'>
		{props.children}
	</div>

export const EditorTextContentBlock = (props) =>
	<div id='editor_text_block' className='col-md-12'>
		{props.children}
	</div>

export const EditorBottomBarContentBlock = (props) =>
	<div id='editor_top_bar_block' className='col-md-12'>
		{props.children}
	</div>	

export const EditorAttributeContentBlock = (props) =>
	<div id='editor_attribute_block' className='col-md-12'>
		{props.children}
	</div>	