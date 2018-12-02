import React from 'react'

import defaultTagColors from '../modules/editorSettings'

const TagColorPicker = ({input, onChange, onColorSwatchClick}) =>
	<div className='input-group'>
	  <div className='input-group-prepend'>
	    <span className='input-group-text' id='basic-addon1'>#</span>
	  </div>
	  <input type='text' className='form-control' placeholder='Color' value={input} onChange={onChange}/>
	  <div className='input-group-append'>
	    <button className='btn btn-primary dropdown-toggle caret-off' data-toggle='dropdown' type='button'><i className='fas fa-chevron-down'></i></button>
		<div className='dropdown-menu'>
			{defaultTagColors.map(color =>
	      		<div key={color} className='dropdown-item'>
	      			<a className='color_preview' href='#' style={{backgroundColor: '#' + color }} onClick={()=>onColorSwatchClick(color)}></a>
	      		</div>
			)}
	    </div>	    
	  </div>	  
	</div>

export default TagColorPicker