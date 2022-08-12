import React from 'react'

const MediaUploadInput = ({input, onChange}) =>
	<div className="input-group mb-3">
	  <div className="custom-file">
	    <input type="file" className="custom-file-input" id="media_input" onChange={onChange}/>
	    <label className="custom-file-label" htmlFor="media_input">{input ? input[0].name : 'Choose file'}</label>
	  </div>
	</div>

export default MediaUploadInput