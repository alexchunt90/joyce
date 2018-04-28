import axios from 'axios'

const apiRoute = '/api/'

// Axios HTTP Functions
export const HTTPGetDocumentList = (docType, state) =>
	axios.get(apiRoute + docType).then(res => {
		return {status: 'success', docType: docType, state: state, data: res.data}
	}).catch(error => {
		return {status: 'error', docType: docType, state: state, data: error}
	})

export const HTTPGetDocumentText = (id, docType, state) =>
	axios.get(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, state: state, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, state: state, data: error}
	})

export const HTTPDeleteDocument = (id, docType) =>
	axios.delete(apiRoute + docType + '/' + id).then(res => {
		return {id: id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
	})

export const HTTPPutCreateDocument = (docType, data) =>
	axios.put(apiRoute + docType + '/', data).then(res => {
		return {status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {status: 'error', docType: docType, data: error}
	})

export const HTTPPostWriteDocument = (id, docType, data) =>
	axios.post(apiRoute + docType + '/' + id, data).then(res => {
		return {id: data.id, status: 'success', docType: docType, data: res.data}
	}).catch(error => {
		return {id: id, status: 'error', docType: docType, data: error}
	})

export const HTTPPostSearchResults = (data) =>
	axios.post(apiRoute + 'search/', { data }).then(res => {
		console.log('data is ', data)
		return {status: 'success', data: res.data}
	}).catch(error => {
		return {status: 'error', data: res.data}
	})

