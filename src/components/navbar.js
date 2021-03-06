 import React from 'react'
 import { Link } from 'react-router-dom'

const Navbar = () =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<Link to='/' className='navbar-brand'>The Joyce Project</Link>
		<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarItems'>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className='collapse navbar-collapse'>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item' data-toggle='collapse'>
					<Link to='/notes' className='nav-link'>Notes</Link>
				</li>
				<li className='nav-item' data-toggle='collapse'>
					<Link to='/edit' className='nav-link'>Edit</Link>
				</li>
				<li className='nav-item' data-toggle='collapse'>
					<Link to='/search' className='nav-link'>Search</Link>
				</li>					      	
			</ul>
		</div>
	</nav>

export default Navbar