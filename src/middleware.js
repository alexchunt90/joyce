import axios from 'axios'

const joyceAPIService = state => next => action => {
	next(action)
	switch(action.type) {
		case 'GET_CHAPTER_DATA':
			axios.get('/api/chapters').then(res => {
				const data = res.data
				return next({
					type: 'GET_CHAPTER_DATA_RECEIVED',
					data
				})
			}).catch(error => {
				return next({
					type: 'GET_CHAPTER_DATA_ERROR',
					error
				})
			})
			break		
		defaut:
			break
	}
}

export default joyceAPIService