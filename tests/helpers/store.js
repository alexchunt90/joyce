// Builds a real Redux store — the actual root reducer and the actual middleware —
// so middleware tests exercise routing, reducers and action flow together rather
// than in isolation.
//
// src/joyce.js wires the store the same way, except that ReduxRouter (the React
// component) is what subscribes to history and dispatches ON_LOCATION_CHANGED.
// createRouterMiddleware only translates push/replace *actions* into history calls;
// it does not listen to history. So the harness subscribes the same way ReduxRouter
// does, which is what makes history.push() drive the middleware here.

import { configureStore } from '@reduxjs/toolkit'
import { createRouterMiddleware, onLocationChanged } from '@lagunovsky/redux-react-router'
import { createBrowserHistory } from 'history'

import reduceJoyce from '../../src/reducers/reduceJoyce'
import actions from '../../src/actions'

// Records every action that reaches it, so a test can assert on what a middleware
// dispatched rather than only on the state that survived.
export const createRecorder = () => {
	const actions = []
	const middleware = () => next => action => {
		actions.push(action)
		return next(action)
	}
	return {
		middleware,
		actions,
		ofType: type => actions.filter(a => a.type === type),
		clear: () => { actions.length = 0 },
	}
}

// `observer` is placed ahead of every real middleware, including the router's.
// createRouterMiddleware intercepts CALL_HISTORY_METHOD and does not pass it on, so
// anything sitting behind it never sees the paths joyceRouter pushes. The observer
// always calls next(), so watching from the front changes nothing about behaviour
// while keeping the real middleware in their production order.
export const buildStore = (middleware = [], { path = '/', observer = null } = {}) => {
	// jsdom keeps one window per test file; reset the URL so tests do not inherit
	// whatever the previous one navigated to.
	window.history.replaceState({}, '', path)

	const history = createBrowserHistory()
	const store = configureStore({
		reducer: reduceJoyce(history),
		middleware: getDefault =>
			getDefault({ serializableCheck: false, immutableCheck: false })
				.prepend(
					...(observer ? [observer] : []),
					createRouterMiddleware(history),
					...middleware,
				),
	})

	history.listen(({ location, action }) => {
		store.dispatch(onLocationChanged(location, action))
	})

	// Navigate and let the middleware see it, the way a user clicking a link would.
	const navigate = to => history.push(to)

	// Re-announce the current location without changing it, which is what ReduxRouter
	// does on mount.
	const announceLocation = () =>
		store.dispatch(onLocationChanged(history.location, history.action))

	return { store, history, navigate, announceLocation }
}

// Document fixtures shaped like the API's list responses. Ids are 20 characters to
// match real Elasticsearch ids: regex.PATH_WITH_ID requires at least 18, so a shorter
// id is not recognised as an id at all and the routing branches never fire.
export const CHAPTERS = [
	{ id: 'chapterAAAAAAAAAA001', number: 1, title: 'Telemachus', created_at: 100 },
	{ id: 'chapterAAAAAAAAAA004', number: 4, title: 'Calypso', created_at: 200 },
	{ id: 'chapterAAAAAAAAAA018', number: 18, title: 'Penelope', created_at: 300 },
]
export const NOTES = [
	{ id: 'noteAAAAAAAAAAAAAA01', title: 'Buck Mulligan', created_at: 100 },
	{ id: 'noteAAAAAAAAAAAAAA02', title: 'Martello Tower', created_at: 200 },
]
// Titles here must match src/config.js infoPageTitleConstants — joyceRouter resolves
// the /notes/* info routes by matching on title, not id.
export const INFO = [
	{ id: 'infoAAAAAAAAAAAAAA01', number: 1, title: 'Methods', created_at: 100 },
	{ id: 'infoAAAAAAAAAAAAAA02', number: 2, title: 'Tally of Notes', created_at: 200 },
	{ id: 'infoAAAAAAAAAAAAAA03', number: 3, title: 'Index of Titles', created_at: 300 },
	{ id: 'infoAAAAAAAAAAAAAA04', number: 4, title: 'Latest News', created_at: 400 },
	{ id: 'infoAAAAAAAAAAAAAA05', number: 5, title: 'Colors', created_at: 500 },
	{ id: 'infoAAAAAAAAAAAAAA06', number: 6, title: 'Sources', created_at: 600 },
	{ id: 'infoAAAAAAAAAAAAAA07', number: 7, title: 'Contributors', created_at: 700 },
]
export const TAGS = [{ id: 'tagAAAAAAAAAAAAAAA01', title: 'Homeric', color: 'FF0000' }]
export const MEDIA = [{ id: 'mediaAAAAAAAAAAAAA01', title: 'Martello Tower', type: 'img' }]
export const EDITIONS = [{ id: 'editionAAAAAAAAAAA01', year: 1922, title: 'Shakespeare' }]

// Load the document lists the app fetches at startup. `except` leaves a list unseeded,
// which is how a reader actually starts: src/joyce.js does not fetch media.
export const seedDocumentLists = (store, { except = [] } = {}) => {
	const lists = {
		chapters: CHAPTERS, notes: NOTES, info: INFO,
		tags: TAGS, media: MEDIA, editions: EDITIONS,
	}
	for (const [docType, data] of Object.entries(lists)) {
		if (except.includes(docType)) continue
		store.dispatch(actions.getDocumentList({ docType, status: 'success', data }))
	}
}
