import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { SearchButton } from '../components/button'
import SearchResultsBox from '../components/searchResultsBox'
import { clickSearch } from '../actions/userActions'
import { updateSearchInput } from '../actions/inputActions'

const JoyceSearchContent = ({searchResults, searchInput, onSearchInputChange, onSearchClick}) =>
	<div className='container'>
		<div className='row'>
			<div className='col-sm-2'>
				<SearchButton onClick={onSearchClick} searchInput={searchInput}/>
			</div>
			<div className='col-sm-10'>
				<input id='search_input' type='text' value={searchInput} onChange={onSearchInputChange} />
			</div>
		</div>
		<div className='row'>
			<SearchResultsBox searchResults={searchResults} />
		</div>
	</div>

const mapStateToProps = state => {
	return {
		searchResults: state.searchResults,
		searchInput: state.searchInput
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSearchInputChange: searchInput => {
			dispatch(updateSearchInput(searchInput))
		},
		onSearchClick: searchInput => {
			dispatch(clickSearch(searchInput))
		}
	}
}

const JoyceSearchContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceSearchContent)

export default JoyceSearchContentContainer