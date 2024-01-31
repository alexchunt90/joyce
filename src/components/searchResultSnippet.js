import React from 'react'
import PropTypes from 'prop-types'

const buildSnippetLink = (key, docType, route) => {
	if (docType === 'chapter') {
		return '/' + route + '#' + key
	} else {
		return '/' + docType + 's/' + route + '#' + key
	}
}

const SearchResultSnippet = ({snippet, docType, route, onLinkClick}) =>
	<div id={snippet.key}>
		<a href={buildSnippetLink(snippet.key, docType, route)} onClick={onLinkClick}>
			{snippet.text}
		</a>
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.object,
}

export default SearchResultSnippet