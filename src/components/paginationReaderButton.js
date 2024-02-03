import React from 'react'
import PropTypes from 'prop-types'

const PaginationReaderButton = ({toggle, loading, editions, onPaginationToggle, setPaginationEdition, size='md'}) =>
	<div>
		<div id='pagination_button' className='text-center'>
			<button onClick={onPaginationToggle} disabled={loading} className={toggle ? 'btn btn-primary btn-md' + size : 'btn btn-outline-primary btn-' + size} id='pagination_toggle_button'>
				{toggle ? 'Unpaginate' : 'Paginate'}
				{loading &&
					<i className="fa-solid fa-spinner fa-spin"></i>
				}
			</button>
			<button className='btn btn-primary dropdown-toggle btn-md' type='button' id='pagination_edition_select' data-toggle='dropdown'>
			</button>
			<div className='dropdown-menu'>
				{editions.map(edition =>
					<a key={edition.id} className='dropdown-item' onClick={()=>setPaginationEdition(edition)}>
						{edition.title} ({edition.year})
					</a>
				)}
			</div>		
		</div>
	</div>

export default PaginationReaderButton