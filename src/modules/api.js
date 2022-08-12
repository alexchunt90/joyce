import axios from 'axios'

const apiRoute = '/api/'

const api = {

	// List Function
	HTTPGetDocumentList: (docType) =>
		axios.get(apiRoute + docType).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),


	// Document CRUD
	HTTPGetDocumentText: (id, docType, state) =>
		axios.get(apiRoute + docType + '/' + id).then(res => {
			return {id: id, status: 'success', docType: docType, state: state, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, state: state, data: error}
		}),	
	HTTPDeleteDocument: (id, docType) =>
		axios.delete(apiRoute + docType + '/' + id).then(res => {
			return {id: id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),
	HTTPPutCreateDocument: (docType, data) =>
		axios.put(apiRoute + docType + '/', data).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),
	HTTPPostWriteDocument: (id, docType, data) =>
		axios.post(apiRoute + docType + '/' + id, data).then(res => {
			return {id: id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),

	// Media-specific CRUD
	HTTPPostCreateMediaDocument: (docType, formData, headers={}) =>
		axios.post(apiRoute + docType + '/', formData, headers).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),
	HTTPPostWriteMediaDocument: (id, docType, formData, headers={}) =>
		axios.post(apiRoute + docType + '/' + id, formData, headers).then(res => {
			return {id: id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),		

	// Search Fuctions
	HTTPPostSearchResults: (data) =>
		axios.post(apiRoute + 'search/', { data }).then(res => {
			return {status: 'success', data: res.data}
		}).catch(error => {
			return {status: 'error', data: res.data}
		}),

	// Admin Functions
	HTTPGetRefreshList: (docType) =>
		axios.get(apiRoute + 'refresh/').then(res => {
			return {status: 'success', data: res.data}
		}).catch(error => {
			return {status: 'error', data: error}
		}),

}		

export default api