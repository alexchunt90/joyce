import React from 'react'
import PropTypes from 'prop-types'

import api from '../modules/api'

import { ReaderAnnotateButton, ReaderEditButton, EditorToolButton, EditorDeleteToolButton, AnnotatorNewButton, AnnotatorRemoveButton } from './button'

const refreshElasticsearch = () => {
	api.HTTPGetRefreshList().then(response =>
		location.reload()
	)
}

const AdminHeader = ({toggles, hideAdmin}) =>
	<div id='admin_header' className={toggles.admin ? 'admin_show' : 'admin_hide'}>
		<button type='button' className='btn btn-sm btn-outline-primary' onClick={refreshElasticsearch}>
			Refresh Seed Data
		</button>
		<button className='btn btn-sm btn-outline-primary' onClick={hideAdmin}>
			<i className='fa fa-times'></i>
		</button>
	</div>

export default AdminHeader

AdminHeader.propTypes = {
	refreshElasticsearch: PropTypes.func,
}