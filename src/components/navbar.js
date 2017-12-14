import React from 'react'

const Navbar = () =>
	<nav className='navbar navbar-inverse navbar-static-top navbar-expand-lg'>
		<a className='navbar-brand' href='/'>The Joyce Project</a>
		<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarItems'>
			<span className='navbar-toggler-icon'><i className='fa fa-bars fa-lg' /></span>
		</button>		
		<div id='navbarItems' className='collapse navbar-collapse'>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<a className='nav-link' href='/editor'>Editor</a>
				</li>
				<li className='nav-item'>
					<a className='nav-link' href='/notes'>Notes</a>
				</li>		      	
				<li className='nav-item'>
					<a className='nav-link' href='/search'>Search</a>
				</li>
				<li className='nav-item'>
					<a className='nav-link' href='/about'>About</a>
				</li>
			</ul>
		</div>		
	</nav>

export default Navbar