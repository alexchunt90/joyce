import React from 'react'


const uploadMessageString = (currentDocument) => {
	if (currentDocument.id) {
		return 'Choose new file to upload (optional)'
	} else {
		return 'Choose file to upload'
	}
}

const MediaUploadInput = ({input, onChange, currentDocument}) =>
	<div className="input-group mb-3">
	  <div className="custom-file">
	    <input type="file" className="custom-file-input" id="media_input" onChange={onChange}/>
	    <label className="custom-file-label" htmlFor="media_input">{input ? input[0].name : uploadMessageString(currentDocument)}</label>
	  </div>
	</div>

export default MediaUploadInput