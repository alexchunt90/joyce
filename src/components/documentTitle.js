// TODO: Extract Romanize into a mix-in
// TODO: Buggy af above 19
import React from 'react'
const romanize = (num) => {
	let roman_numeral = ''
	const values = [
		{1000: 'M'},
		{500: 'D'},
		{100: 'C'},
		{50: 'L'},
		{40: 'XL'},
		{10: 'X'},
		{9: 'IX'},
		{5: 'V'},
		{4: 'IV'},
		{1: 'I'}
	]
	for (let i = num ; i > 0;) {
		for (const key in values) {
			const obj = values[key]
			numberCheck: {
				for (let id in obj) {
					if (i - id >= 0) {
						roman_numeral = roman_numeral + obj[id]
						i = i - id
					}
				}
			}			
		}
	}
	return roman_numeral
}

const DocumentTitle = ({docType, currentDocument}) =>
	<h4>
		{docType === 'chapters' &&
			currentDocument.number ? romanize(currentDocument.number) + '. ' : ''
		}
		{currentDocument.title ? currentDocument.title : ''}		
	</h4>

export default DocumentTitle