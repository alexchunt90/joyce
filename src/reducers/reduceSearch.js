import { combineReducers } from 'redux'

import searchResults from './searchResults'
import searchInput from './searchInput'

const reduceSearch = combineReducers({
	searchResults,
	searchInput
})

export default reduceSearch