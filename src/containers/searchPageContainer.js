import React from 'react'
import { connect } from 'react-redux'

import SearchContentContainer from '../containers/searchContentContainer'

const SearchPage = () =>
	<div id='joyce_page' className='container-fluid'>
		<div id='content_wrapper' className='row'>
			<SearchContentContainer />
		</div>
	</div>

const SearchPageContainer = connect()(SearchPage)

export default SearchPageContainer