import React from 'react'

import Navbar from '../components/navbar'
import Content from '../components/content'
import JoyceNotesSidebarContainer from '../containers/joyceNotesSidebarContainer'
import JoyceNotesContentContainer from '../containers/joyceNotesContentContainer'

const JoyceNotesPageContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceNotesSidebarContainer />
				<Content>
					<JoyceNotesContentContainer />
				</Content>
			</div>
		</div>
	</div>

export default JoyceNotesPageContainer