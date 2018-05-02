import React from 'react'
import { connect } from 'react-redux'

import JoyceSearchContentContainer from '../containers/joyceSearchContentContainer'

const JoyceSearchPage = () =>
	<div id='joyce_reader' className='container-fluid'>
		<div id='content_window' className='row'>
			<JoyceSearchContentContainer />
		</div>
	</div>

const JoyceSearchPageContainer = connect()(JoyceSearchPage)

export default JoyceSearchPageContainer