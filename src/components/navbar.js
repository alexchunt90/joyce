import React from 'react'

const Navbar = () =>
	<nav className='navbar navbar-toggleable-md navbar-static-top navbar-expand-lg navbar-inverse'>
		<a className='navbar-brand' href='/'>The Joyce Project</a>
	  	<div id="navbarNav">
		    <ul className="navbar-nav">
		      	<li className="nav-item">
		        	<a className="nav-link" href="/edit">Text</a>
		      	</li>
		      	<li className="nav-item">
		        	<a className="nav-link" href="/notes">Notes</a>
		      	</li>		      	
		      	<li className="nav-item">
			        <a className="nav-link" href="/search">Search</a>
				</li>
				<li className="nav-item">
			        <a className="nav-link" href="/about">About</a>
				</li>
		    </ul>
		</div>		
	</nav>

export default Navbar