import axios from 'axios'

const apiRoute = '/api/'
const authRoute = '/auth/'
const baseURL= 'http://localhost:5000'

// TODO: Docs suggest Axios can do this automatically with withXSRFToken but I couldn't get it working
const getCSRFToken = () => {
	if (typeof document !== 'undefined') {
		const cookies = document.cookie
		if (cookies.includes('csrf_access_token')) {
			const token = cookies.match(/csrf_access_token=([a-z0-9\-]*)/g).toString().split(/\=/g)[1]
			return token
		} else {
			return null
		}
	} else {
		return null
	}
}

const authedInstance = axios.create({
	baseURL: 'http://localhost:5000',
	withCredentials: true,
	headers: {'X-CSRF-TOKEN': getCSRFToken()},
	withXSRFToken: true,
	xsrfCookiename: 'csrf_access_token',
	xsrfHeaderName: 'X-CSRF-TOKEN',
})

authedInstance.interceptors.request.use((config) => {
	config.headers['X-CSRF-TOKEN'] = getCSRFToken()
	return config
}, (error) => {
	return Promise.reject(error)
})

const api = {

	// List Documents of type
	HTTPGetDocumentList: (docType) =>
		axios.get(baseURL + apiRoute + docType).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),
	// Takes an array of doc_ids, retreives full details for those documents
	HTTPPostRetrieveDocuments: (doc_ids, docType) =>
		axios.post(apiRoute + docType + '/bulk/', doc_ids).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {	
			return {status: 'error', docType: docType, data: error}
		}),

	// Update search text fields. Only used during setup.
	HTTPUpdateSearchText: (id, data) =>
		axios.post(baseURL + apiRoute + 'search_text/' + id, data).then(res => {
			return {status: 'success'}
		}).catch(error => {	
			return {status: 'error'}
		}),

	// Document CRUD
	HTTPGetDocumentText: (id, docType, state) =>
		axios.get(baseURL + apiRoute + docType + '/' + id).then(res => {
			return {id: id, status: 'success', docType: docType, state: state, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, state: state, data: error}
		}),	
	HTTPDeleteDocument: (id, docType) =>
		authedInstance.delete(apiRoute + docType + '/' + id).then(res => {
			return {id: id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),
	HTTPPutCreateDocument: (docType, data) =>
		authedInstance.put(apiRoute + docType + '/', data).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),
	HTTPPostWriteDocument: (id, docType, data) =>
		authedInstance.post(apiRoute + docType + '/' + id, data).then(res => {
			return {id: id, status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {id: id, status: 'error', docType: docType, data: error}
		}),

	// Media-specific CRUD
	HTTPPostCreateMediaDocument: (docType, formData, headers={}) =>
		authedInstance.post(apiRoute + docType + '/', formData, headers).then(res => {
			return {status: 'success', docType: docType, data: res.data}
		}).catch(error => {
			return {status: 'error', docType: docType, data: error}
		}),
	HTTPPostWriteMediaDocument: (id, docType, formData, headers={}) =>
		authedInstance.post(apiRoute + docType + '/' + id, formData, headers).then(res => {
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

	// Post Google Auth JWT to Backend, Receive Access and Refresh Tokens
	HTTPPostOAuthToken: (credential) =>
		authedInstance.post(authRoute + 'token/', { credential }).then(res => {
			return {status: 'success', data: res}
		}).catch(error => {
			return {status: 'error', data: error}
		}),

	// Logout by requesting backend unset token cookies
	HTTPPostLogout: () =>
		authedInstance.post(authRoute + 'logout/').then(res => {
			return {status: 'success', data: res}
		}).catch(error => {
			return {status: 'error', data: error}
		})
}		

export default api