import React from 'react'

const SearchResultsBox = ({searchResults}) =>
	<div className='search_results_box'>
			<div className='chapter_search_results'>
				<h4>Chapters</h4>
				{searchResults.chapter && searchResults.chapter.map(result =>
					<div key={result.id}>{result.highlight}</div>
				)}
			</div>
	</div>

export default SearchResultsBox