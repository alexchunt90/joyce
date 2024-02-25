import React from 'react'

export const EditorTitleContentBlock = (props) =>
	<div id='editor_title_block' className='col-md-12'>
		{props.children}
	</div>

export const EditorTopBarContentBlock = (props) =>
	<div id='editor_top_bar_block' className='col-md-12'>
		{props.children}
	</div>

export const EditorTextContentBlock = (props) =>
	<div id='editor_text_block' className='col-md-12 d-flex flex-column flex-grow-1'>
		<div className='col-md-12'>
			{props.children}
		</div>
	</div>

export const EditorBottomBarContentBlock = (props) =>
	<div id='editor_top_bar_block' className='col-md-12'>
		{props.children}
	</div>	

export const EditorAttributeContentBlock = (props) =>
	<div id='editor_attribute_block' className='col-md-12'>
		{props.children}
	</div>	