import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from 'draft-js'

import actions from '../actions'
import { SearchButton } from '../components/button'
import SearchResultsBox from '../components/searchResultsBox'

const SearchContent = ({
	searchResults,
	inputs,
	onSearchInputChange,
	onSearchClick,
	onToggleSearchDocType,
	onResultCountDropdownClick,
	onSearchLinkClick,
}) =>
	<div className='container'>
		<div className='row'>
			<div className='col-sm-6 col-md-2 mt-1'>
			    <label className="form-check-label">Result Count:</label>			
			</div>
			<div className='col-sm-6 col-md-2 mt-1'>
				<div className='input-group'>
			    	<span className='input-group-text'>#</span>
					<input type='text' className='form-control' placeholder='#' value={inputs.searchResultCount} onChange={()=>{return true}}/>
			    	<button className='btn btn-primary btn-sm dropdown-toggle caret-off' data-bs-toggle='dropdown' type='button'><i className='fas fa-chevron-down'></i></button>
					<div className='dropdown-menu'>
		      			<div className='dropdown-item'>
		      				<a className='result_count_item' href='#' onClick={()=>onResultCountDropdownClick(5)}>5</a>
			      		</div>
			      		<div className='dropdown-item'>
			      			<a className='result_count_item' href='#' onClick={()=>onResultCountDropdownClick(10)}>10</a>
			      		</div>
			      		<div className='dropdown-item'>
			      			<a className='result_count_item' href='#' onClick={()=>onResultCountDropdownClick(25)}>25</a>
			      		</div>
			      		<div className='dropdown-item'>
			      			<a className='result_count_item' href='#' onClick={()=>onResultCountDropdownClick(50)}>50</a>
			      		</div>			      		
				    </div>	      
				</div>
			</div>													
			<div className='col-3 col-md-2 mt-1'>
				<input type="checkbox" className="form-check-input" defaultChecked={inputs.searchDocTypes.chapters} onClick={()=>onToggleSearchDocType('chapters')}/>
			    <label className="form-check-label">Chapters</label>			
			</div>
			<div className='col-3 col-md-2 offset-1 mt-1'>
				<input type="checkbox" className="form-check-input" defaultChecked={inputs.searchDocTypes.notes} onClick={()=>onToggleSearchDocType('notes')}/>
			    <label className="form-check-label">Notes</label>			
			</div>
			<div className='col-4 col-md-2 offset-1 mt-1'>
				<input type="checkbox" className="form-check-input" defaultChecked={inputs.searchDocTypes.info} onClick={()=>onToggleSearchDocType('info')}/>
			    <label className="form-check-label">About Pages</label>			
			</div>
		</div>
		<div className='row mt-2'>
			<div className='col-8'>
				<input id='search_input' type='text' value={inputs.search} onChange={onSearchInputChange} />
			</div>
			<div className='col-3 offset-1'>
				<SearchButton onClick={onSearchClick} searchInput={inputs.search} docTypes={inputs.searchDocTypes} resultCount={inputs.searchResultCount}/>
			</div>
		</div>
		<div className='row'>
			{Object.keys(searchResults).length !== 0 && 
				<SearchResultsBox searchResults={searchResults} onLinkClick={onSearchLinkClick}/>
			}
		</div>
	</div>

const mapStateToProps = state => {
	return {
		searchResults: state.searchResults,
		inputs: state.inputs
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSearchInputChange: input => {
			dispatch(actions.updateSearchInput(input))
		},
		onResultCountDropdownClick: count => {
			dispatch(actions.onResultCountDropdownClick(count))
		},
		onSearchClick: (searchInput, docTypes, resultCount) => {
			console.log('SEARCH INPUT:', searchInput)
			dispatch(actions.clickSearch(searchInput, docTypes, resultCount))
		},
		onToggleSearchDocType: docType => {
			dispatch(actions.toggleSearchDocType(docType))
		},
		onSearchLinkClick: (id, key) => {
			dispatch(actions.setCurrentBlock(id, key))
		}
	}
}

SearchContent.propTypes = {
	searchResults: PropTypes.object,
	inputs: PropTypes.object,
	onSearchInputChange: PropTypes.func,
	onSearchClick: PropTypes.func,
}

const SearchContentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchContent)

export default SearchContentContainer