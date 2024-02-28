import React from 'react'

import { defaultTagColors } from '../config'

const TagColorPicker = ({input, onChange, onColorSwatchClick}) =>
	<div className='input-group'>
	  <div className='input-group-prepend'>
	    <span className='input-group-text' id='basic-addon1'>#</span>
	  </div>
	  <input type='text' className='form-control' placeholder='Color' value={input} onChange={onChange}/>
	  <div className='input-group-append'>
	    <button className='btn btn-primary dropdown-toggle caret-off' data-bs-toggle='dropdown' type='button'><i className='fas fa-chevron-down'></i></button>
		<div className='dropdown-menu'>
			{Object.entries(defaultTagColors).map(color =>
	      		<div key={color[1]} className='dropdown-item'>
	      			<a className='color_preview' href='#' style={{backgroundColor: '#' + color[1] }} onClick={()=>onColorSwatchClick(color[1])}></a>
	      		</div>
			)}
	    </div>	    
	  </div>	  
	</div>

export default TagColorPicker