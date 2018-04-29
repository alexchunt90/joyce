import React from 'react'
import { connect } from 'react-redux'

import Navbar from '../components/navbar'
import JoyceSearchContentContainer from '../containers/joyceSearchContentContainer'

const JoyceSearchPage = () =>
	<div>
		<Navbar />
		<JoyceSearchContentContainer />
	</div>

const JoyceSearchPageContainer = connect()(JoyceSearchPage)

export default JoyceSearchPageContainer