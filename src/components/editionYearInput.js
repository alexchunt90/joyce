import React from 'react'
import PropTypes from 'prop-types'

const EditionYearInput = ({input, onChange}) =>
	<div className="input-group mb-3">
	  <div className="input-group-prepend">
	    <span className="input-group-text" id="basic-addon1">Year:</span>
	  </div>
	  <input type="text" className="form-control" value={input} onChange={onChange} placeholder='Edition Year'/>
	</div>

EditionYearInput.propTypes = {
	input: PropTypes.string,
	onCHange: PropTypes.func
}

export default EditionYearInput