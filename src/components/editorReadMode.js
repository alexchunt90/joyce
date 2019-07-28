import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'

import { ReadModeTopBar }  from '../components/contentTopBar'
import actions from '../actions'
import DocumentTitle from '../components/documentTitle'
import LoadingSpinner from '../components/loadingSpinner'

const EditorReadMode = ({
	currentDocument,
	editorState,
	docType,
	toggles,
	setMode
}) =>
	<div id='editor_read_mode'  className='editor_wrapper'>
		<div id='editor_metadata'>
			<DocumentTitle docType={docType} currentDocument={currentDocument} />
		</div>
		<div id='editor_topbar'>
			<ReadModeTopBar docType={docType} setMode={setMode} />
		</div>	
		<div id='editor_content' className={'read_mode ' + docType}>
			<Editor editorState={editorState} readOnly={true}/>
		</div>
	</div>

export default EditorReadMode