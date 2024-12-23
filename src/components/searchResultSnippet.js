import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'



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
	<div id={snippet.key}>
		<Link to={buildSnippetLink(snippet.key, docType, route)} >
			<div dangerouslySetInnerHTML={{__html: snippet.text}}>
			</div>
			{/*{snippet.text}*/}
		</Link>
	</div>

SearchResultSnippet.propTypes = {
	snippet: PropTypes.object,
}

export default SearchResultSnippet