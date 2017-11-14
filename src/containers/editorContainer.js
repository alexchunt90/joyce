import React from 'react'

import TextEditorContainer from '../containers/textEditorContainer'
import Navbar from '../components/navbar'
import EditorSidebarContainer from '../containers/editorSidebarContainer'
import Content from '../components/content'

const EditorContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_editor' className='container-fluid'>
			<div className="row">
				<EditorSidebarContainer />
				<Content>
					<TextEditorContainer />
				</Content>
			</div>
		</div>
	</div>

export default EditorContainer