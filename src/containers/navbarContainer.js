import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import actions from '../actions'

const Navbar = ({user, navCollapse, toggleNavCollapse}) =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<NavLink to='/:id' className='navbar-brand'>The Joyce Project</NavLink>
		<button className='navbar-toggler' type='button' onClick={()=>toggleNavCollapse()}>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className={navCollapse ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'}>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<NavLink to='/notes' className='nav-link'>Notes</NavLink>
				</li>
				<li className='nav-item'>
					<NavLink to='/search' className='nav-link'>Search</NavLink>
				</li>
				{user.isLoggedIn &&
					<li className='nav-item'>
						<NavLink to='/edit' className='nav-link'>Edit</NavLink>
					</li>
				}
				{user.isLoggedIn &&
					<li className='nav-item'>
						<NavLink to='/admin' className='nav-link'>Admin</NavLink>
					</li>
				}
			</ul>
		</div>
	</nav>


const mapStateToProps = state => {
	return {
		user: state.user,
		navCollapse: state.toggles.navCollapse,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		toggleNavCollapse: () => {
			dispatch(actions.toggleNavCollapse())
		}
	}
}

const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(Navbar)

export default NavbarContainer