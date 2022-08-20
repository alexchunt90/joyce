import regex from '../modules/regex'

const paginate = {
	testPaginate: (data) => {
		console.log('TESTING PAGINATION:')
		const html = data.html_source
		console.log('HTML DATA RECEIVED:', html)


		console.log('END RESULT:', html)
	},
	docTypeName: docType => {
		return docType
	}
}

export default paginate