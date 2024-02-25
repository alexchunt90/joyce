import React from 'react'

const InlineImage = (props) => {
	const src = props.blockProps.src
    return (
    	<img src={src}/>
    )
}

export default InlineImage