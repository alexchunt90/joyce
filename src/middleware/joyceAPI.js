import actions from '../actions'
import api from '../modules/api'
import regex from '../modules/regex'

// API Middleware
const joyceAPI = store => next => action => {
	next(action)
	switch(action.type) {
		case 'GET_DOCUMENT_LIST':
			if (action.status === 'request') {
				api.HTTPGetDocumentList(action.docType).then(response =>
					store.dispatch(actions.getDocumentList(response))
				)
			}
			break
		case 'GET_DOCUMENT_TEXT':
			if (action.status === 'request') {
				api.HTTPGetDocumentText(action.id, action.docType, action.state).then(response =>
					store.dispatch(actions.getDocumentText(response))
				)
			}	
			break
		case 'SAVE_DOCUMENT':
			if (action.status === 'request') {
				if (action.id) {
					api.HTTPPostWriteDocument(action.id, action.docType, action.data).then(response =>
						store.dispatch(actions.saveDocument(response))
				)} else {
					api.HTTPPutCreateDocument(action.docType, action.data).then(response =>
						store.dispatch(actions.saveDocument(response))
					)
				}
			}
			break
		case 'DELETE_DOCUMENT':
			if (action.status === 'request') {
				api.HTTPDeleteDocument(action.id, action.docType).then(response =>
					store.dispatch(actions.deleteDocument(response))
				)
			}
			break
		case 'GET_SEARCH_RESULTS':
			if (action.status === 'request') {
				api.HTTPPostSearchResults(action.data).then(response =>
					store.dispatch(actions.getSearchResults(response))
				)
			}
			break	
		case 'UPLOAD_MEDIA_SUBMIT':
			api.HTTPGetSignedPost().then(response =>
				store.dispatch(actions.uploadMediaToS3Request(response, action.data[0])
			))
			break
		case 'UPLOAD_TO_S3_REQUEST':
			const formData = new FormData()
			const url = action.signed_post.url
			formData.append('key', action.signed_post.fields.key)
			formData.append('AWSAccessKeyId', action.signed_post.fields.AWSAccessKeyId)
			formData.append('acl', 'public-read')
			formData.append('policy', action.signed_post.fields.policy)
			formData.append('signature', action.signed_post.fields.signature)
			formData.append('file', action.file)
			api.HTTPPostMedia(url, formData).then(response =>
				store.dispatch(actions.uploadMediaToS3Response(response))
			)
		default:
			break
	}
}

export default joyceAPI