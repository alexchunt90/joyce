import React from 'react'
import PropTypes from 'prop-types'

const buildSnippetLink = (key, docType, route) => {
	console.log('DocType is ', docType)
	if (docType === 'chapter') {
		return '/' + route + '#' + key
	} else {
		return '/' + docType + 's/' + route + '#' + key
	}
}

const SearchResultSnippet = ({snippet, docType, route}) =>
	<div id={snippet.key}>
		<a href={buildSnippetLink(snippet.key, docType, route)}>
			{snippet.text}
		</a>
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.object,
}

export default SearchResultSnippet