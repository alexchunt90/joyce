import React from 'react'

import Navbar from '../components/navbar'
import Content from '../components/content'
import JoyceReaderSidebarContainer from '../containers/joyceReaderSidebarContainer'
import JoyceReaderContentContainer from '../containers/joyceReaderContentContainer'

const ReaderContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<JoyceReaderSidebarContainer />
				<Content>
					<JoyceReaderContentContainer />
				</Content>
			</div>
		</div>
	</div>

export default ReaderContainer