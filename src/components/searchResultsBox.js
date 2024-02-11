import React from 'react'
import PropTypes from 'prop-types'

import SearchResultSnippet from './searchResultSnippet'

const SearchResultGroup = ({docType, docTitle, results, onLinkClick}) =>
	<div id={docType + '_search_results'} className='result_type_group'>
		<h4>{docTitle}</h4>
		{results.map(result =>
			<div key={result.id}>
				<h5>{result.title}</h5>
				{result.hits.map(hit =>
					<SearchResultSnippet key={hit.key} snippet={hit} docType={docType} route={docType === 'chapter' ? result.number : result.id} onClick={()=>{onLinkClick(hit.key)}}/>
				)}
			</div>
		)}		
	</div>

const sumResults = (searchResults) => {
	let resultCount = 0
	for (const [key, value] of Object.entries(searchResults)) {
		resultCount += value.length
	}
	return resultCount
}

const SearchResultsBox = ({searchResults, onLinkClick}) =>
		<div id='search_results_box' className='col-sm-12'>
			{searchResults.hasOwnProperty('chapters') && searchResults.chapters.length > 0 &&
				<SearchResultGroup docType='chapter' docTitle='Chapters' results={searchResults.chapters} onLinkClick={onLinkClick}/>
			}
			{searchResults.hasOwnProperty('notes') && searchResults.notes.length > 0 &&
				<SearchResultGroup docType='note' docTitle='Notes' results={searchResults.notes} onLinkClick={onLinkClick}/>
			}
			{searchResults.hasOwnProperty('media') && searchResults.media.length > 0 &&
				<SearchResultGroup docType='media' docTitle='Media' results={searchResults.media} onLinkClick={onLinkClick}/>
			}
			{sumResults(searchResults) < 1 &&
				<div className='result_type_group'>
					<h4>No Results Found.</h4>
				</div>
			}
		</div>

SearchResultGroup.propType = {
	docType: PropTypes.string,
	docTitle: PropTypes.string,
	results: PropTypes.array,
}

SearchResultsBox.propTypes = {
	searchResults: PropTypes.objectOf(PropTypes.array)
}

export default SearchResultsBox