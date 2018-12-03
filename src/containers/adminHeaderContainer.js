import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../actions'
import api from '../modules/api'

const refreshElasticsearch = () => {
	api.HTTPGetRefreshList().then(response =>
		location.reload()
	)
}

const AdminHeader = ({toggles, hideAdmin, showAdmin}) => {
	if (toggles.admin === true) {
		return (
			<div id='admin_header' className={toggles.admin ? 'admin_show' : 'admin_hide'}>
				<div id='admin_title'>Admin Tools:</div>
				<button type='button' className='btn btn-sm btn-outline-primary' onClick={refreshElasticsearch}>
					Refresh Seed Data
				</button>
				<button className='btn btn-sm btn-outline-primary' onClick={hideAdmin}>
					<i className='fas fa-times'/>
				</button>
			</div>
		)
	} else {
		return (
			<div id='open_admin_button'>
				<button type='button' className='btn btn-sm btn-outline-danger' onClick={showAdmin}>
					<i className='fas fa-screwdriver'/>
				</button>
			</div>
		)
	}
}


const mapStateToProps = state => {
	return {
		toggles: state.toggles,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		hideAdmin: () => {
			dispatch(actions.hideAdmin())
		},
		showAdmin: () => {
			dispatch(actions.showAdmin())
		}
	}
}

const AdminHeaderContainer = connect(mapStateToProps, mapDispatchToProps)(AdminHeader)

export default AdminHeaderContainer

AdminHeader.propTypes = {
	refreshElasticsearch: PropTypes.func,
}