import React from 'react'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'

import actions from '../actions'
import {infoPageTitleConstants} from '../config'

const Navbar = ({user, navCollapse, toggleNavCollapse, info}) => {
	
	const noteInfoPages = Object.values(infoPageTitleConstants)
	const filteredInfo = info.filter(page => !noteInfoPages.includes(page.title))
	return (
	<nav className='navbar navbar-light navbar-static-top navbar-expand-lg'>
		<NavLink to='/:id' className='navbar-brand'>
			{/*Home*/}
			<img src="/static/icon_sheer.png" alt="" width="45" height="36" className="d-inline-block align-text-top" />
		</NavLink>
		<button className='navbar-toggler' type='button' onClick={()=>toggleNavCollapse()}>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className={navCollapse ? 'collapse navbar-collapse' : 'collapse navbar-collapse show'}>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<NavLink to='/search' className='nav-link'>Search</NavLink>
				</li>
				<li className="nav-item dropdown">
          			<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Notes</a>
					{/*<NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">Notes</NavLink>*/}
	          		<ul className="dropdown-menu">
	            			<li>
	            				<Link className='dropdown-item' to='/notes/about'>About the Notes</Link>
	            				<Link className='dropdown-item' to='/notes/color'>Colors</Link>
	            				<Link className='dropdown-item' to='/notes/index'>Index of Titles</Link>
	            				<Link className='dropdown-item' to='/notes/news'>Latest News</Link>
	            				<Link className='dropdown-item' to='/notes/sources'>Sources</Link>
	            				<Link className='dropdown-item' to='/notes/comment'>Comment</Link>
	            				<Link className='dropdown-item' to='/notes/tally'>Tally of Notes</Link>
            				</li>
	          		</ul>
        		</li>
				<li className="nav-item dropdown">
          			<a className="nav-link dropdown-toggle" href="#"role="button" data-bs-toggle="dropdown">Info</a>
	          		<ul className="dropdown-menu">
	          			{filteredInfo.length > 0 && filteredInfo.map(infoDoc => 
	            			<li key={infoDoc.id}><Link className='dropdown-item' to={'/info/' + infoDoc.id}>{infoDoc.title}</Link></li>
          				)}
	          		</ul>
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
	)
}

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