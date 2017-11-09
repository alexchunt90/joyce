import React from 'react'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Content from '../components/content'

const EditorContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_editor' className='container-fluid'>
			<div className="row">
				{console.log('Hey you')}
				<Sidebar />
				<Content />
			</div>
		</div>
	</div>

export default EditorContainer