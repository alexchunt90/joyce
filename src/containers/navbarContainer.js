import React from 'react'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'

import actions from '../actions'

const Navbar = ({user, navCollapse, toggleNavCollapse, info}) =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<NavLink to='/:id' className='navbar-brand'>Home</NavLink>
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
				<li className="nav-item dropdown">
          			<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">About</a>
	          		<ul className="dropdown-menu">
	          			{info.length > 0 && info.map(infoDoc => 
	            			<li key={infoDoc.id}><Link className='dropdown-item' to={'/info/' + infoDoc.id}>{infoDoc.title}</Link></li>
          				)}
	          		</ul>
        		</li>					
			</ul>
		</div>
	</nav>


const mapStateToProps = state => {
	return {
		info: state.info,
		user: state.user,
		navCollapse: state.toggles.navCollapse,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		toggleNavCollapse: () => {
			dispatch(actions.toggleNavCollapse())
		},

	}
}

const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(Navbar)

export default NavbarContainer