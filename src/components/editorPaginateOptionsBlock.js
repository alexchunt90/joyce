import React from 'react'

const EditorPaginateOptions = ({editions, setPaginationEdition}) =>
	<div className='row'>
		<div className='paginate_option_buttons col-5'>
			<div className='dropdown'>
			<button className={'btn btn-primary dropdown-toggle btn-sm'} type='button' data-toggle='dropdown'>
				Select Edition
			</button>
			<div className='dropdown-menu'>
				{editions.length > 0 && editions.map(edition =>
					<a key={editions.id} className='dropdown-item' onClick={()=>setPaginationEdition(edition)}>
						{edition.title} ({edition.year})
					</a>
				)}
			</div>
		</div>
		</div>
	</div>	

export default EditorPaginateOptions