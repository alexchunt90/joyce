# Plan: Annotation note ID as a URL query param in Read mode

## Goal

When a reader opens an annotation note in the modal, reflect the note's ID in the URL as a
query string parameter (`?note=<note_id>`), so that:

1. Refreshing the page reopens the same annotation modal.
2. Every note opened is its own history entry, so the browser Back button steps backward
   through a chain of notes (note → note → note → back to the chapter).

Read mode only (the reader; and, for free, the editor's READ_MODE, which shares the same
decorator and modal — see "Scope: editor mode" below). No backend work: `blueprints/joyce.py`
already serves the SPA shell for any path, and query strings are ignored server-side.

## Core architectural decision: make the URL the source of truth

Today the flow is: a reader clicks a `LinkContainer` `<a>` →
`dispatch(selectAnnotationNote(id))` → `joyceInterface` fires
`getDocumentText({state: 'annotationNote'})` → the `annotationNote` / `modalEditorState`
reducers fill in, while Bootstrap opens `#annotation_modal` on its own via the anchor's
`data-bs-toggle` / `data-bs-target` attributes. The URL is not involved at all.

The change inverts that: **a click pushes a URL; the location change is what loads the note
and opens the modal.**

```
click link  →  OPEN_ANNOTATION_NOTE  →  push('/4?note=<id>')
                                            ↓
                          @@router/ON_LOCATION_CHANGED  (joyceRouter)
                                            ↓
                       selectAnnotationNote(id)  +  show modal
                                            ↓
                (existing) GET_DOCUMENT_TEXT state:'annotationNote'
                        → annotationNote / modalEditorState reducers
```

Back/forward then work for free, because a history pop is just another
`ON_LOCATION_CHANGED` with a different (or absent) `note` param — it runs the exact same
code path as a click. This is the single most important property of the design: **there is
no separate "restore from history" branch to keep in sync.**

Consequence: `LinkContainer` must stop relying on Bootstrap's `data-bs-toggle` to open the
modal, and the modal's show/hide becomes programmatic. Otherwise Bootstrap opens the modal
on click while the URL-driven path tries to open it too, and a Back that should close the
modal leaves it open.

## Files to touch

| File | Change |
|---|---|
| `src/config.js` | Add `ANNOTATION_QUERY_PARAM = 'note'` constant. |
| `src/modules/annotationURL.js` *(new)* | Pure helpers to read/build paths carrying the `note` param. |
| `src/modules/modalControl.js` *(new)* | The only place that touches Bootstrap for `#annotation_modal`: show, hide, is-open, and the "we hid it ourselves" guard. |
| `src/actions/userActions.js` | Add `openAnnotationNote(id)` and `closeAnnotationNote()`. Leave `selectAnnotationNote` alone — the editor's ChooseAnnotationModal still uses it directly. |
| `src/containers/linkContainer.js` | Dispatch `openAnnotationNote`; drop `data-bs-toggle`/`data-bs-target`. |
| `src/containers/linkModalContainer.js` | Dispatch `openAnnotationNote` (this is the in-modal link that creates the chain). |
| `src/middleware/joyceRouter.js` | Handle `OPEN_ANNOTATION_NOTE`, `CLOSE_ANNOTATION_NOTE`, and the `note` param inside `ON_LOCATION_CHANGED`; preserve the param across the existing redirect pushes. |
| `src/components/annotationModal.js` | Add a `hidden.bs.modal` listener that dispatches `closeAnnotationNote()` when the user closes the modal (X / ESC / backdrop). |
| `src/containers/readerPageContainer.js` | Pass `onModalHidden` to `AnnotationModal`; make `<Navigate to=':id'/>` preserve `location.search`. |
| `src/containers/editorPageContainer.js` | Same two changes if editor read mode is in scope. |
| `src/reducers/annotationNoteMedia.js` | Clear on `GET_DOCUMENT_TEXT` request for `annotationNote` (stale-media bug, see Phase 5). |
| `tests/annotationURL.test.js`, `tests/joyceRouter.test.js` *(new)* | Unit tests for the helpers and the middleware. |

## Phase 1 — URL helpers and config

`src/config.js`:

```js
export const ANNOTATION_QUERY_PARAM = 'note'
```

`src/modules/annotationURL.js` — pure functions, no Redux, no DOM beyond `location`
defaults, so they are directly unit-testable:

```js
import { ANNOTATION_QUERY_PARAM } from '../config'

const annotationURL = {
	// Returns the note id in the current query string, or undefined
	parseNoteParam: (search = location.search) =>
		new URLSearchParams(search).get(ANNOTATION_QUERY_PARAM) || undefined,

	// '/4' + id -> '/4?note=<id>' (preserves any other params and the hash)
	pathWithNote: (id, pathname = location.pathname, search = location.search, hash = location.hash) => { ... },

	// '/4?note=<id>#abc' -> '/4#abc'
	pathWithoutNote: (pathname = location.pathname, search = location.search, hash = location.hash) => { ... },

	// Used when joyceRouter redirects to a new identifier and we want to keep the note open
	carryNoteParam: (path, search = location.search) => { ... },
}
```

Notes for the implementer:
- Keep the hash. `joyceRouter` already uses `location.hash` to jump to a search-result block
  (`setCurrentBlock`), so a URL can legitimately be `/4?note=<id>#<blockKey>`. Any push that
  rewrites the query must not drop the hash, and vice versa.
- `URLSearchParams` is fine in the browser targets this project builds for and in jsdom.
- Match surrounding style: this codebase does not use optional chaining; don't introduce it
  in these modules for consistency.

## Phase 2 — Modal control module

`src/modules/modalControl.js` centralizes the Bootstrap imperative API (there is precedent:
`joyceInterface.js` already calls `bootstrap.Modal.getInstance(...).hide()`).

```js
import * as bootstrap from 'bootstrap'

const ANNOTATION_MODAL_ID = 'annotation_modal'
let selfInitiatedHide = false

const getInstance = () => {
	const element = document.getElementById(ANNOTATION_MODAL_ID)
	return element ? bootstrap.Modal.getOrCreateInstance(element) : undefined
}

const modalControl = {
	showAnnotationModal: () => { const m = getInstance(); if (m) m.show() },
	// Hide initiated by us (URL change), so the hidden listener must not push a new URL
	hideAnnotationModal: () => { selfInitiatedHide = true; const m = getInstance(); if (m) m.hide() },
	isAnnotationModalOpen: () => {
		const element = document.getElementById(ANNOTATION_MODAL_ID)
		return element ? element.classList.contains('show') : false
	},
	// Read-and-reset: true if the hide that just happened was ours
	consumeSelfInitiatedHide: () => { const value = selfInitiatedHide; selfInitiatedHide = false; return value },
}

export default modalControl
```

The `selfInitiatedHide` flag is the one piece of mutable module state, and it exists to
break exactly one loop: URL change → we hide the modal → Bootstrap fires `hidden.bs.modal`
→ (without the guard) we'd dispatch `closeAnnotationNote` → push another URL.

`getOrCreateInstance` (not `getInstance`) matters: with `data-bs-toggle` removed from the
anchors, Bootstrap may never have instantiated the modal, so `getInstance` returns null on
the very first open and on a cold refresh deep link.

## Phase 3 — Actions and link containers

`src/actions/userActions.js`:

```js
// Click a note link in the reader — the router middleware turns this into a URL push
openAnnotationNote: id => ({ type: 'OPEN_ANNOTATION_NOTE', id: id }),
// User dismissed the annotation modal (X, ESC, backdrop)
closeAnnotationNote: () => ({ type: 'CLOSE_ANNOTATION_NOTE' }),
```

`src/containers/linkContainer.js`: dispatch `openAnnotationNote(data['url'])` and **remove**
`data-bs-toggle='modal'` and `data-bs-target='#annotation_modal'`. Keep `data-color` /
`data-url` (they round-trip into `html_source`; check `src/modules/draftConversion.js`
before removing anything else from the anchor).

`src/containers/linkModalContainer.js`: same dispatch swap. This container is the note-to-note
link inside the modal — i.e. the "chain of note lines" the feature is about — and it never had
the Bootstrap attributes, so no attribute change here.

`ChooseAnnotationModal` (editor annotate mode) keeps dispatching `selectAnnotationNote`
directly: it picks a note to attach to a selection and must not touch the URL. Verify this
still works — it renders `#annotate_modal`, a *different* element from `#annotation_modal`.

## Phase 4 — joyceRouter: the whole state machine

All three additions go in `src/middleware/joyceRouter.js`.

**a) `OPEN_ANNOTATION_NOTE`** — push, don't load:

```js
case 'OPEN_ANNOTATION_NOTE':
	// Guard: re-clicking the link for the note already open must not stack history entries
	if (annotationURL.parseNoteParam() !== action.id) {
		store.dispatch(push(annotationURL.pathWithNote(action.id)))
	} else if (!modalControl.isAnnotationModalOpen()) {
		modalControl.showAnnotationModal()
	}
	break
```

**b) `CLOSE_ANNOTATION_NOTE`** — push the clean URL:

```js
case 'CLOSE_ANNOTATION_NOTE':
	if (typeof annotationURL.parseNoteParam() !== 'undefined') {
		store.dispatch(push(annotationURL.pathWithoutNote()))
	}
	break
```

Decision — **push, not replace**, on close. After reading A → B → C and closing, Back
returns to `?note=C` and reopens the modal where the reader left off. `replace` would make
Back jump to B, which reads as the modal reopening on the wrong note.

**c) `ON_LOCATION_CHANGED`** — add at the **end** of the existing case, after all the
existing redirect logic, so it never runs on a path that is about to be replaced:

```js
const noteParam = annotationURL.parseNoteParam()
if (typeof noteParam !== 'undefined') {
	if (noteParam !== annotationNote.id) {
		store.dispatch(actions.selectAnnotationNote(noteParam))   // existing load path
	}
	if (!modalControl.isAnnotationModalOpen()) {
		modalControl.showAnnotationModal()
	}
} else if (modalControl.isAnnotationModalOpen()) {
	modalControl.hideAnnotationModal()
}
```

Walk the cases to convince yourself:
- **First click** — no param → param: loads + shows. ✅
- **Chain click (A→B)** — param A → param B, `annotationNote.id` is A: loads B, modal already open. ✅
- **Back (B→A)** — param B → param A, `annotationNote.id` is B: mismatch, reloads A. ✅
- **Back off the first note** — param → no param: hides (guarded, so no push loop). ✅
- **Forward** — identical to a click. ✅
- **Refresh** — see Phase 6. ✅

**d) Preserve the param across the existing redirect pushes.** `joyceRouter` already pushes
relative identifiers in several places (`push(routeID)` in the redirect-path branch, and
`push(actionIdentifier)` in `GET_DOCUMENT_TEXT`). A relative push drops the query string.
Two different behaviors are wanted:

- Redirects that resolve a *placeholder* path (`/:id` → `/1`, `Navigate to=':id'`) should
  **carry the note param through** — otherwise a deep link landing on a placeholder path
  loses the note. Use `annotationURL.carryNoteParam(...)`.
- A genuine document change (reader picks a different chapter from the sidebar) should
  **drop** the note param and close the modal. That happens naturally today, because the
  relative `push('3')` drops the query — but confirm the modal actually closes via the
  `else` branch in (c), since ON_LOCATION_CHANGED will see no param.

**e) React Router `<Navigate>`**: `readerPageContainer.js:39,42` (and
`editorPageContainer.js:51`) render `<Navigate to=':id'/>`, which does not preserve search.
Change to `<Navigate to={':id' + location.search + location.hash} />` (or the object form
with `search`/`hash`). Without this, a deep link to `/` or `/notes` with a note param drops it.

## Phase 5 — The modal component

`src/components/annotationModal.js` is currently a pure functional component. Add an effect
that wires `hidden.bs.modal` to the close action. Keep the component presentational by
taking `onModalHidden` as a prop (the reader page supplies it; the editor page can pass a
no-op if editor mode is out of scope):

```js
React.useEffect(() => {
	const element = document.getElementById('annotation_modal')
	if (!element || typeof onModalHidden !== 'function') { return }
	const handler = () => {
		if (!modalControl.consumeSelfInitiatedHide()) { onModalHidden() }
	}
	element.addEventListener('hidden.bs.modal', handler)
	return () => element.removeEventListener('hidden.bs.modal', handler)
}, [onModalHidden])
```

Pass a stable callback from `readerPageContainer`'s `mapDispatchToProps`
(`onModalHidden: () => dispatch(actions.closeAnnotationNote())`) — `connect` keeps it
referentially stable, so the effect won't re-subscribe on every render.

**Adjacent bug worth fixing in the same change:** `annotationNoteMedia` only resets on
`SET_CURRENT_DOCUMENT` and only refills when a note *has* media
(`joyceInterface.js` guards on `media_doc_ids.length > 0`). Reading a chain where note A has
images and note B does not leaves A's images rendered next to B's text. Chains make this far
more visible, so add to `src/reducers/annotationNoteMedia.js`:

```js
case 'GET_DOCUMENT_TEXT':
	if (action.status === 'request' && action.state === 'annotationNote') { return [] }
	// ...existing GET_MEDIA_DOCS handling unchanged
```

## Phase 6 — Deep link on load (refresh)

Two ordering facts make this mostly free:

1. `AnnotationModal` is rendered unconditionally by `ReaderPageContainer`, including while
   `toggles.loading` is true — so `#annotation_modal` exists in the DOM early.
2. Loading a note by id (`HTTPGetDocumentText`) does **not** depend on the `notes` list
   having loaded, so the fetch can start immediately at boot.

So the deep-link path is the same code as everything else, provided the initial location
actually produces an `ON_LOCATION_CHANGED`. **Verify this first** —
`@lagunovsky/redux-react-router` v4 should dispatch on mount, but if it does not, add an
explicit boot-time dispatch in `src/joyce.js` after the `getDocumentList` calls:

```js
const bootNote = annotationURL.parseNoteParam()
if (bootNote) { store.dispatch(actions.openAnnotationNote(bootNote)) }
```

(`openAnnotationNote` is safe at boot: the param already matches, so it takes the
`else if` branch and just shows the modal.)

Expected refresh UX: the modal appears immediately, briefly empty, then fills in — the same
behavior as a click today. If a blank flash on a cold load looks wrong, the alternative is to
show the modal on `GET_DOCUMENT_TEXT` success for `state === 'annotationNote'` instead of on
location change; that trades the flash for a delay on every click. Start with immediate-show.

Also confirm an invalid/deleted note id fails gracefully: `HTTPGetDocumentText` errors →
`status: 'error'` → reducers hold their previous state. Decide the behavior explicitly —
recommended: on a failed `annotationNote` fetch, hide the modal and push the clean path so a
stale bookmark degrades to the plain chapter.

## Phase 7 — Scope: editor mode

`readerDecorator` (which uses `LinkContainer`) is also used by the editor's READ_MODE, and
`EditorPageContainer` renders the same `AnnotationModal`. With the changes above, `/edit/...`
would start pushing `?note=` too. Recommendation: **let it work in both** — it is the same
reading experience and needs no extra code. Just verify the editor's own modals are
unaffected: `#annotate_modal` (ChooseAnnotationModal, annotate mode) and
`#external_url_modal` both keep their existing `data-bs-*` behavior, and `joyceInterface`'s
`bootstrap.Modal.getInstance(document.getElementById('annotate_modal')).hide()` still targets
a modal Bootstrap has instantiated.

If the editor turns out to fight the URL logic (e.g. `SET_EDITOR_DOC_TYPE` pushes), gate the
`OPEN_ANNOTATION_NOTE` push on `!regex.checkEditRoute(path)` and fall back to a direct
`selectAnnotationNote` + `showAnnotationModal` there.

## Phase 8 — Tests

`npm test` shells out to a nonexistent `python setup.py`; run `npx jest` directly. The
existing `tests/api.test.js` hits a live server — do not follow that pattern for these.

New unit tests (pure, no server):

- `tests/annotationURL.test.js` — `parseNoteParam` (present / absent / empty), `pathWithNote`
  and `pathWithoutNote` preserving hash and other params, `carryNoteParam`.
- `tests/joyceRouter.test.js` — drive the middleware with a hand-rolled `store` mock
  (`getState` returning a minimal state object, `dispatch` recording actions) and jsdom
  `history.pushState` to set the URL. Assert:
  - `OPEN_ANNOTATION_NOTE` pushes `?note=<id>`; a repeat for the same id does not push.
  - `ON_LOCATION_CHANGED` with a new param dispatches `SELECT_ANNOTATION_NOTE`.
  - `ON_LOCATION_CHANGED` with a param equal to `annotationNote.id` does **not** refetch.
  - `ON_LOCATION_CHANGED` with no param hides the modal and dispatches nothing.
  - `CLOSE_ANNOTATION_NOTE` pushes the clean path.
  Mock `../modules/modalControl` with `jest.mock` so no Bootstrap/DOM is required.

## Phase 9 — Manual QA checklist

Run `npm run watch` plus the Docker stack (see README), then in the reader:

1. Click a note link → URL becomes `/<chapter>?note=<id>`, modal opens with the right note.
2. Refresh that URL → same modal, same note, same chapter.
3. Click a link inside the modal → URL updates, modal swaps to the new note; images from the
   previous note are gone when the new note has none.
4. Build a chain of 3–4 notes, then press Back repeatedly → walks back note by note, then
   closes the modal on the chapter URL, then leaves the chapter.
5. Forward from there → replays the chain.
6. Close the modal with X, ESC, and the backdrop → each removes `?note=` exactly once (watch
   for double history entries).
7. Copy a `?note=` URL into a fresh tab → opens correctly (deep link, cold cache).
8. With the modal open, use the sidebar to switch chapters → modal closes, param is gone.
9. A note deep link with a search hash (`/4?note=<id>#<blockKey>`) → both the block jump and
   the modal work.
10. Notes-as-pages (`/notes/<id>`) and the info pages under `/notes/tally` etc. → links there
    behave the same and do not break those routes' redirect logic.
11. Editor `/edit` read mode → links still open the modal (per Phase 7 decision).
12. Mobile width → modal and Back behavior unchanged.

## Risks and gotchas

- **Push loops.** The two guards (`parseNoteParam() !== action.id`, and
  `consumeSelfInitiatedHide()`) are load-bearing. Removing either produces an infinite
  location-change/push cycle. Add the `joyceRouter` tests that cover them.
- **Fallthrough cases in `joyceRouter`.** The `SET_EDITOR_STATE` / `SET_CURRENT_BLOCK` /
  `SAVE_DOCUMENT` cases in the existing switch deliberately (or accidentally) fall through —
  do not add the new cases in the middle of that run; put them before `default` and make sure
  each `break`s.
- **Relative pushes drop the query.** Every existing `push()` in `joyceRouter` takes a bare
  identifier. Audit each one and decide carry-vs-drop (Phase 4d) rather than assuming.
- **Bootstrap instance identity.** With `data-bs-toggle` gone, only `modalControl` may create
  the instance. Anywhere else calling `bootstrap.Modal.getInstance` on `#annotation_modal`
  must be updated to `getOrCreateInstance` or routed through `modalControl`.
- **`annotationNote` never clears.** The reducer keeps the last note after the modal closes,
  which is what makes the `noteParam !== annotationNote.id` comparison work — but it also
  means "close, then reopen the same note" must be handled by the `else if` show branch in
  `OPEN_ANNOTATION_NOTE`, not by a refetch.
- **Param name.** `note` collides with nothing today. Keep it in `config.js` so it is changed
  in one place.

## Suggested commit sequence

1. `annotationURL` + `modalControl` modules + config constant + their unit tests.
2. Actions, link containers, programmatic modal open/close (feature works for click + close,
   no history yet).
3. `joyceRouter` location-change handling + `<Navigate>` search preservation (history + back +
   refresh) + middleware tests.
4. `annotationNoteMedia` stale-media fix.
5. QA pass, then any editor-mode gating from Phase 7.
