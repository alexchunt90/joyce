import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const stripPageBreaksFromSearchText = (snippetText) => {
	const pageBreakPattern = /[0-9]{4,4}\#[0-9]{1,3}/
	const strippedText = snippetText.replace(pageBreakPattern, '')
	return strippedText
}

const buildSnippetLink = (key, docType, route) => {
	if (docType === 'chapter') {
		return '/' + route + '#' + key
	} else if (docType === 'info') {
		return '/' + docType + '/' + route + '#' + key
	} else {
		return '/' + docType + 's/' + route + '#' + key
	}
}

const SearchResultSnippet = ({snippet, docType, route, onClick}) =>
	<div id={snippet.key} className='search_result_snippet'>
		<Link to={buildSnippetLink(snippet.key, docType, route)} >
			<div dangerouslySetInnerHTML={{__html: stripPageBreaksFromSearchText(snippet.text)}}>
			</div>
			{/*{snippet.text}*/}
		</Link>
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.object,
}

export default SearchResultSnippet