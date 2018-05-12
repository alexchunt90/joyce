import React from 'react'
import PropTypes from 'prop-types'

const SearchResultSnippet = ({snippet}) =>
	<div>
		{snippet}...
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.string,
}

export default SearchResultSnippet