import React from 'react'

import Navbar from '../components/navbar'
import Content from '../components/content'
import JoyceChaptersContentContainer from '../containers/joyceChaptersContentContainer'
import JoyceChaptersSidebarContainer from '../containers/joyceChaptersSidebarContainer'

const JoyceChaptersPage = () =>
	<div>
		<Navbar />
		<div id='joyce_editor' className='container-fluid'>
			<div className="row">
				<JoyceChaptersSidebarContainer />
				<Content>
					<JoyceChaptersContentContainer />
				</Content>
			</div>
		</div>
	</div>

export default JoyceChaptersPage