 import React from 'react'

const Navbar = () =>
	<nav className='navbar navbar-dark navbar-static-top navbar-expand-lg'>
		<a className='navbar-brand' href='/'>The Joyce Project</a>
		<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarItems'>
			<span className='navbar-toggler-icon'></span>
		</button>		
		<div id='navbarItems' className='collapse navbar-collapse'>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<a className='nav-link' href='/edit'>Edit</a>
				</li>
				<li className='nav-item'>
					<a className='nav-link' href='/notes'>Notes</a>
				</li>		      	
			</ul>
		</div>		
	</nav>

const string = "<li className='nav-item'><a className='nav-link' href='/search'>Search</a></li><li className='nav-item'><a className='nav-link' href='/about'>About</a></li>"

export default Navbar