import React from 'react'
import SearchResultSnippet from './searchResultSnippet'

const SearchResultGroup = ({docType, docTitle, results}) =>
	<div id={docType + '_search_results'} className='result_type_group'>
		<h4>{docTitle}</h4>
		{results.map(result =>
			<div key={result.id}>
				<h5>{result.title}</h5>
				{result.highlight.map(highlight =>
					<SearchResultSnippet snippet={highlight} />
				)}
			</div>
		)}		
	</div>

const SearchResultsBox = ({searchResults}) =>
	<div id='search_results_box' className='col-sm-12'>
		{searchResults.chapter &&
			<SearchResultGroup docType='chapter' docTitle='Chapters' results={searchResults.chapter}/>
		}
		{searchResults.note &&
			<SearchResultGroup docType='note' docTitle='Notes' results={searchResults.note}/>
		}
	</div>

export default SearchResultsBox