import React from 'react'
import PropTypes from 'prop-types'

const ReaderPageBackButton = ({onClick, disabled}) =>
	<button onClick={onClick} className='btn btn-block btn-outline-primary btn-sm' disabled={disabled}>
		<i className='fas fa_inline fa-icon-double-angle-left'></i>
		Previous Page
	</button>

const ReaderPageForwardButton = ({onClick, disabled}) =>
	<button onClick={onClick} className='btn btn-block btn-outline-primary btn-sm' disabled={disabled}>
		Next Page
		<i className='fas fa_inline fa-icon-double-angle-right'></i>
	</button>

const ReaderPageButtons = ({pagesArray, currentPageNumber, setPageNumber}) => {
	const indexOfCurrentPage = pagesArray.indexOf(currentPageNumber)
	const previousPageIndex = indexOfCurrentPage - 1
	const previousPageNumber = pagesArray[previousPageIndex] ? pagesArray[previousPageIndex] : undefined
	const nextPageIndex = indexOfCurrentPage + 1
	const nextPageNumber = pagesArray[nextPageIndex] ? pagesArray[nextPageIndex] : undefined
	return <div id='reader_page_select_buttons' className='row'>
			<div className='page_back_button col-5'>
				<ReaderPageBackButton onClick={()=>setPageNumber(previousPageNumber)} disabled={previousPageNumber ? false : true}/>
			</div>
			<div className='col-2 text-center page_number'>
				<strong>{currentPageNumber}</strong>
			</div>
			<div className='page_forward_button col-5'>
				<ReaderPageForwardButton onClick={()=>setPageNumber(nextPageNumber)} disabled={nextPageNumber ? false : true} />
			</div>	
		</div>
}

export default ReaderPageButtons

ReaderPageButtons.propTypes = {
	docs: PropTypes.arrayOf(PropTypes.object),
	setPaginationEdition: PropTypes.func,	
}