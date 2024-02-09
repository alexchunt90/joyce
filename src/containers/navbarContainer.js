 import React from 'react'
 import { connect } from 'react-redux'
 import { NavLink } from 'react-router-dom'

const Navbar = ({user}) =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<NavLink to='/:id' className='navbar-brand'>The Joyce Project</NavLink>
		<button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarItems'>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className='collapse navbar-collapse'>
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
		user: state.user
	}
}

const NavbarContainer = connect(mapStateToProps)(Navbar)

export default NavbarContainer