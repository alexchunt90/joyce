import React from 'react'

import NotePageContainer from '../containers/notePageContainer'
import Navbar from '../components/navbar'
import NoteSidebarContainer from '../containers/noteSidebarContainer'
import Content from '../components/content'

const JoyceNotesPageContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<NoteSidebarContainer />
				<Content>
					<NotePageContainer />
				</Content>
			</div>
		</div>
	</div>

export default JoyceNotesPageContainer