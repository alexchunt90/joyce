import axios from 'axios'

let apiRoute = '/api/chapters/'

const joyceAPIService = state => next => action => {
	next(action)
	switch(action.type) {
		case 'GET_CHAPTER_DATA':
			axios.get(apiRoute).then(res => {
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
		case 'GET_TEXT_DATA':
			axios.get(apiRoute + action.id).then(res=> {
				const data = res.data
				return next({
					type: 'GET_TEXT_DATA_RECEIVED',
					data
				})
			}).catch(error => {
				return next({
					type: 'GET_TEXT_DATA_ERROR',
					error
				})
			})
			break
		defaut:
			break
	}
}

export default joyceAPIService