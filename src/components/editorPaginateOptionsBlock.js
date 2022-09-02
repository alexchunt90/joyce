import React from 'react'

const EditionSelectDropdownItem = ({edition, onClick}) =>
	<a className='dropdown-item' onClick={onClick}>
		{edition.title} ({edition.year})
	</a>

const SetPageBreakButton = ({onClick, selectionState, pageNumberInput, currentEdition}) => {
	let collapsed = undefined
	let disabled = true
	const isInteger = Number.isInteger(parseInt(pageNumberInput))
	if (Object.keys(selectionState).length > 0) {
		collapsed = selectionState.isCollapsed()
	}
	if (
		collapsed === true && 
		isInteger === true &&
		currentEdition !== undefined
	) {
		disabled = false
	}
	return <button 
		className={'btn btn-block btn-primary btn-sm'} 
		onClick={()=>onClick(pageNumberInput, currentEdition.year, selectionState)} 
		type='button' 
		disabled={disabled}
	>
		Set!
	</button>
}

const PageNumberInput = ({input, onChange}) =>
	<div className="input-group mb-3">
	  <div className="input-group-prepend">
	    <span className="input-group-text" id="basic-addon1">Page Number:</span>
	  </div>
	  <input type="text" className="form-control" value={input} onChange={onChange} placeholder='#'/>
	</div>	

const EditorPaginateOptions = ({
	editions, 
	currentEdition=undefined, 
	selectionState,
	setPaginationEdition, 
	pageNumberInput, 
	onPageNumberInputChange,
	createPageBreak
}) =>
	<div className='row'>
		<div className='paginate_option_buttons col-4'>
			<div className='dropdown'>
				<button className={'btn btn-primary dropdown-toggle btn-sm'} type='button' data-toggle='dropdown'>
					{currentEdition ? currentEdition.title : 'Select Edition'}
				</button>
				<div className='dropdown-menu'>
					{editions.length > 0 && editions.map(edition =>
						<EditionSelectDropdownItem 
							edition={edition} 
							onClick={()=>setPaginationEdition(edition)} 
							key={edition.id} 
						/>
					)}
				</div>
			</div>
		</div>
		<div className='paginate_option_buttons col'>
			<PageNumberInput input={pageNumberInput} onChange={onPageNumberInputChange}/>
		</div>
		<div className='set_page_break_button col'>
			<SetPageBreakButton 
				onClick={createPageBreak} 
				selectionState={selectionState} 
				pageNumberInput={pageNumberInput}
				currentEdition={currentEdition}
			/>
		</div>
	</div>	

export default EditorPaginateOptions