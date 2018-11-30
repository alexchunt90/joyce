import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import actions from '../actions'
import { SearchButton } from '../components/button'
import SearchResultsBox from '../components/searchResultsBox'

const SearchContent = ({
	searchResults,
	inputs,
	onSearchInputChange,
	onSearchClick,
}) =>
	<div className='container'>
		<div className='row'>
			<div className='col-sm-2'>
				<SearchButton onClick={onSearchClick} input={inputs.search}/>
			</div>
			<div className='col-sm-10'>
				<input id='search_input' type='text' value={inputs.search} onChange={onSearchInputChange} />
			</div>
		</div>
		<div className='row'>
			<SearchResultsBox searchResults={searchResults} />
		</div>
	</div>

const mapStateToProps = state => {
	return {
		searchResults: state.searchResults,
		inputs: state.inputs
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSearchInputChange: input => {
			dispatch(actions.updateSearchInput(inputs))
		},
		onSearchClick: searchInput => {
			dispatch(actions.clickSearch(searchInput))
		}
	}
}

SearchContent.propTypes = {
	searchResults: PropTypes.object,
	inputs: PropTypes.object,
	onSearchInputChange: PropTypes.func,
	onSearchClick: PropTypes.func,
}

const SearchContentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchContent)

export default SearchContentContainer