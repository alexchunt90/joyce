import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/navbar'
import JoyceSearchContentContainer from '../containers/joyceSearchContentContainer'

const JoyceSearchPage = () =>
	<div>
		<Navbar />
		<div id='joyce_search' className='container-fluid'>
			<div className="row">
				<JoyceSearchContentContainer />
			</div>
		</div>
	</div>

const JoyceSearchPageContainer = connect()(JoyceSearchPage)

export default JoyceSearchPageContainer