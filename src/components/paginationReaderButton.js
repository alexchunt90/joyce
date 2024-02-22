import React from 'react'
import PropTypes from 'prop-types'

const PaginationReaderButton = ({toggle, loading, editions, onPaginationToggle, choosePaginationEdition, size='md', theme='primary'}) =>
	<div>
		<div id='pagination_button' className='btn-group'>
			<button onClick={onPaginationToggle} disabled={loading} className={toggle ? 'btn btn-info btn-md' + size : 'btn btn-'+theme+' btn-' + size} id='pagination_toggle_button'>
				{toggle ? 'Unpaginate' : 'Paginate'}
				{loading &&
					<i className="fa-solid fa-spinner fa-spin"></i>
				}
			</button>
			<button className={'btn btn-'+theme+' dropdown-toggle btn-md'} type='button' id='pagination_edition_select' data-bs-toggle='dropdown'>
			</button>
			<div className='dropdown-menu'>
				{editions.map(edition =>
					<a key={edition.id} className='dropdown-item' onClick={()=>choosePaginationEdition(edition)}>
						{edition.title} ({edition.year})
					</a>
				)}
			</div>		
		</div>
	</div>

export default PaginationReaderButton