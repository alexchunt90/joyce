import axios from 'axios'

const apiRoute = '/api/'
const api = {
	HTTPGetDocumentList: (docType) =>
		axios.get(apiRoute + docType).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			console.log(error)
			return {status: 'error', docType: docType, data: error}
		}),
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
			return {id: data.id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),
	HTTPPostSearchResults: (data) =>
		axios.post(apiRoute + 'search/', { data }).then(res => {
			return {status: 'success', data: res.data}
		}).catch(error => {
			return {status: 'error', data: res.data}
		}),
	HTTPGetRefreshList: (docType) =>
		axios.get(apiRoute + 'refresh/').then(res => {
			return {status: 'success', data: res.data}
		}).catch(error => {
			return {status: 'error', data: error}
		}),
	HTTPGetSignedPost: () =>
		axios.get(apiRoute + 'signed_post/').then(res=> {
			return {status: 'success', data: res.data}
		}).catch(error => {
			return {status: 'error', data: error}
		}),
	HTTPPostMedia: (url, formData) =>
		axios.post(url, formData, {headers: {'Content-Type': 'image/*', 'ACL': 'public-read'}}).then(res=> {
			return {status: 'success', url: url + formData.get('key')}
		}).catch(error => {
			return {status: 'error', data: error}
		})
}

export default api