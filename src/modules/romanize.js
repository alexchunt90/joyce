// TODO: Buggy af above 19; gotta figure out how to break out of the numberCheck for loop
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

export default romanize