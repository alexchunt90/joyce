import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const FilterInput = () => {
	const filterInput = useSelector((state) => state.inputs.filterInput)
	const dispatch = useDispatch()

	return (
		<input 
			type='text' 
			className='doc_filter_input form-control' 
			value={filterInput} 
			placeholder={'Filter...'}
			onChange={(e)=>dispatch({type: 'UPDATE_FILTER_INPUT', data: e.target.value})}
		/>
	)
}

export default FilterInput