import React from 'react'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import { SearchButton } from '../components/button'
import { updateSearchInput } from '../actions'

const JoyceSearchContent = ({searchResults, searchInput, onSearchInputChange}) =>
	<div id='search_content' className='col-md-11'>
		<input type='text' value={searchInput} onChange={onSearchInputChange}/>
		<SearchButton />
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
		}
	}
}

const JoyceSearchContentContainer = connect(mapStateToProps, mapDispatchToProps)(JoyceSearchContent)

export default JoyceSearchContentContainer