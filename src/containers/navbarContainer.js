 import React from 'react'
 import { connect } from 'react-redux'
 import { Link } from 'react-router-dom'

const Navbar = ({user}) =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<Link to='/:id' className='navbar-brand'>The Joyce Project</Link>
		<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarItems'>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className='collapse navbar-collapse'>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<Link to='/notes' className='nav-link'>Notes</Link>
				</li>
				<li className='nav-item'>
					<Link to='/search' className='nav-link'>Search</Link>
				</li>
				{user.isLoggedIn &&
					<li className='nav-item'>
						<Link to='/edit' className='nav-link'>Edit</Link>
					</li>
				}
				{user.isLoggedIn &&
					<li className='nav-item'>
						<Link to='/admin' className='nav-link'>Admin</Link>
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