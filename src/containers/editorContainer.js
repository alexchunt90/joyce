import React from 'react'

import EditChapterContainer from '../containers/editChapterContainer'
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
					<EditChapterContainer />
				</Content>
			</div>
		</div>
	</div>

export default EditorContainer