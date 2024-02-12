import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'



const buildSnippetLink = (key, docType, route) => {
	if (docType === 'chapter') {
		return '/' + route + '#' + key
	} else if (docType === 'media') {
		return '/' + docType + '/' + route + '#' + key
	} else {
		return '/' + docType + 's/' + route + '#' + key
	}
}

const SearchResultSnippet = ({snippet, docType, route, onClick}) =>
	<div id={snippet.key} onClick={onClick}>
		<Link to={buildSnippetLink(snippet.key, docType, route)} >
			{snippet.text}
		</Link>
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.object,
}

export default SearchResultSnippet