// Helpers for the annotation note query string parameter (e.g. /4?note=<id>).
// Pure functions: every piece of location is a parameter with a window.location default,
// so the router middleware can call them bare and tests can pass explicit values.
import { ANNOTATION_QUERY_PARAM } from '../config'

const buildPath = (pathname, params, hash) => {
	const query = params.toString()
	return pathname + (query ? '?' + query : '') + (hash ? hash : '')
}

const annotationURL = {
	// Returns the note id in the query string, or undefined
	parseNoteParam: (search = location.search) => {
		const value = new URLSearchParams(search).get(ANNOTATION_QUERY_PARAM)
		return value ? value : undefined
	},
	// '/4' + id -> '/4?note=<id>' (preserves other params and the hash)
	pathWithNote: (id, pathname = location.pathname, search = location.search, hash = location.hash) => {
		const params = new URLSearchParams(search)
		params.set(ANNOTATION_QUERY_PARAM, id)
		return buildPath(pathname, params, hash)
	},
	// '/4?note=<id>#abc' -> '/4#abc'
	pathWithoutNote: (pathname = location.pathname, search = location.search, hash = location.hash) => {
		const params = new URLSearchParams(search)
		params.delete(ANNOTATION_QUERY_PARAM)
		return buildPath(pathname, params, hash)
	},
	// Re-attach the note param (if any) to a path the router is about to redirect to,
	// so resolving a placeholder path like /:id -> /1 keeps the modal open
	carryNoteParam: (path, search = location.search) => {
		const id = annotationURL.parseNoteParam(search)
		if (typeof id === 'undefined' || path.indexOf('?') >= 0) {
			return path
		}
		const params = new URLSearchParams()
		params.set(ANNOTATION_QUERY_PARAM, id)
		return path + '?' + params.toString()
	}
}

export default annotationURL
