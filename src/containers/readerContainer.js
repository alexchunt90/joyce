import React from 'react'

import PageContainer from '../containers/pageContainer'
import Navbar from '../components/navbar'
import ReaderSidebarContainer from '../containers/readerSidebarContainer'
import Content from '../components/content'

const ReaderContainer = () =>
	<div>
		<Navbar />
		<div id='joyce_reader' className='container-fluid'>
			<div className="row">
				<ReaderSidebarContainer />
				<Content>
					<PageContainer />
				</Content>
			</div>
		</div>
	</div>

export default ReaderContainer