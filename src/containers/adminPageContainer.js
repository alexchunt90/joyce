import React from 'react'
import { connect } from 'react-redux'

import AdminContentContainer from '../containers/adminContentContainer'

const AdminPage = () =>
	<div id='joyce_page' className='container-fluid'>
		<div id='content_wrapper' className='row'>
			<AdminContentContainer />
		</div>
	</div>

const AdminPageContainer = connect()(AdminPage)

export default AdminPageContainer