# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

Joyce is a "Reader and Editor for Hypertext" — it powers [The Joyce Project](http://www.joyceproject.com/), a site that presents the full text of James Joyce's *Ulysses* with detailed scholarly annotations. It serves two distinct user roles from the same codebase:

- **Readers** (public, unauthenticated): read the chapter text and click hyperlinks embedded in the prose to view linked **notes** (annotations), **info** pages, and other context documents.
- **Editors** (authenticated admins, gated by `ADMIN_EMAIL_ADDRESSES`): use an in-browser rich-text editor to write/annotate chapters and manage the linked documents readers see.

Design and engineering decisions should keep these two experiences in mind — the reading/annotation-browsing UX and the authoring/editing UX are both first-class, but only editors need auth, write access, and the heavier editing UI.

## Architecture

**Stack**: Flask (Python) backend, Elasticsearch as the sole datastore (no relational DB), React + Redux frontend bundled with Webpack, rich text editing via DraftJS, styling with Bootstrap 5 + Sass.

### Backend (`application.py`, `blueprints/`, `config.py`)

- `application.py` builds the Flask app, configures JWT cookie auth (`flask_jwt_extended`), and registers blueprints.
- Blueprints, each mapping to a URL prefix:
  - `blueprints/joyce.py` (`/`) — serves the single `templates/joyce.html` shell (reads the Webpack manifest for asset paths); the SPA takes over from there.
  - `blueprints/doc_api.py` (`/api`) — CRUD REST routes for every document type: `chapters`, `notes`, `info`, `tags`, `editions`. Read routes are public; create/write/delete require `@jwt_required()`.
  - `blueprints/media_api.py` (`/api/media`) — CRUD for uploaded media (images/video/audio) and YouTube embeds.
  - `blueprints/search_api.py` (`/api/search`) — full-text search across document types.
  - `blueprints/google_auth.py` (`/auth`) — Google OAuth sign-in; verifies the Google ID token, checks the email against `config.ADMIN_EMAIL_ADDRESSES`, and issues JWT access/refresh cookies. There is no self-serve account creation — only pre-approved admin emails can authenticate as editors.
- `blueprints/es_func.py` is the single data-access layer over Elasticsearch — all blueprints go through it rather than calling the ES client directly. Each document type is its own ES index; documents are stored with `html_source` (raw annotated HTML) and a derived `search_text` field.
- `config.py` branches on `HOST_ENVIRONMENT` (`local` / `docker` / `staging` / `production`) to pick upload folders, cookie domain, and the Elasticsearch host.
- `setup/` contains one-off/admin scripts (not imported by the running app): `joyce_import.py` and `es_setup.py` create ES index mappings, `*_ops.py` files hold per-doc-type import/migration helpers, `draftImport.js` imports legacy DraftJS content.

### Frontend (`src/`)

Single-page app, entry point `src/joyce.js`. Redux store composed in `src/reducers/reduceJoyce.js` (one reducer per document type — `chapters`, `notes`, `info`, `tags`, `editions`, `media` — plus UI/editor state reducers like `mode`, `docType`, `currentDocument`, `editorState`).

Routing and mode are two separate concerns layered on the same URL space:
- `mode` (reader vs. editor) is driven by whether the path is under `/edit`.
- `docType` (`chapters` / `notes` / `info` / `tags` / `editions` / `media`) is parsed from the path.

The Redux middleware chain (registered in `src/joyce.js`, implemented in `src/middleware/`) is where most cross-cutting logic lives:
- `joyceAPI` — dispatches HTTP calls to the Flask API and turns responses into actions.
- `joyceRouter` (`src/middleware/joyceRouter.js`) — keeps the URL and Redux state in sync in both directions: parses `docType`/document id/number out of the path on navigation, and pushes new paths when the current document changes (e.g. after a save). This file is the best starting point for understanding how routing, `currentDocument`, and `docType` interact.
- `joyceInterface`, `joycePaginate`, `googleAuth` — UI interaction, chapter pagination, and auth session handling respectively.

Reader-facing hyperlinks are literal `<a>` tags inside `html_source`; Elasticsearch's `html_analyzer` (see `setup/es_config.py`) strips all other HTML tags but preserves `<a>` for indexing/search purposes. The DraftJS editor (`src/modules/editorConstructor.js`, `src/modules/draftConversion.js`, `src/components/textEditor.js`) is what editors use to author this HTML, including inserting the links readers click.

Containers under `src/containers/` are the mode-specific page-level components (`readerPageContainer`, `editorPageContainer` and its `editorReadModeContainer` / `editorEditModeContainer` / `editorAnnotateModeContainer` / `editorPaginateModeContainer` sub-modes, `searchPageContainer`, `adminPageContainer`).

## Commands

Local dev requires npm and Python, plus a running Elasticsearch (via Docker) and a
`config.py`/`.env` with secrets — see [README.md](README.md) for first-time setup (cert
generation, ES `vm.max_map_count`, initial data import).

**Python version policy:** production and CI both run **3.11.7** (`Dockerfile` and
`.github/workflows/test.yml` — note `.python-version` is gitignored, so it is a local pyenv
hint only, not the source of truth). Local development on a newer interpreter is
supported and verified — every `requirements.txt` pin is version-independent and the suite
passes identically on 3.11.7 and 3.13 — but CI is the contract for production parity. Do not
bump the Dockerfile's interpreter without a green CI run.

```bash
# Frontend build
npm run watch          # dev build with file watching (local development)
npm run stage          # one-off dev build for a dev server
npm run build           # production build (minified)

# Backend (via Docker Compose)
docker compose build
docker compose up -d

# Data import / ES setup (Flask + Elasticsearch must be running)
python -m setup.joyce_import
npm run local_import    # import legacy DraftJS content locally

# Tests
npm test                # jest (frontend), config in jest.config.js
npm run test:watch      # jest in watch mode
npm run test:py         # pytest (backend), config in ./pytest.ini
npx jest tests/unit/harness.test.js  # run a single frontend test file
.venv/bin/python -m pytest tests/test_harness.py   # run a single backend test file
```

`npm run test:py` invokes `.venv/bin/python` explicitly, not `python3`. This is deliberate:
npm scripts run in a non-interactive shell where zsh aliases do not apply, so a bare
`python3` resolves by PATH order to whichever interpreter comes first — not necessarily the
one with the app's dependencies. Create the venv per [README.md](README.md) before running it.

`npm run test:smoke` runs `tests/smoke/api.test.js`, a legacy live-server test that mutates
real data. It is excluded from `npm test` via `testPathIgnorePatterns` and must never be
pointed at staging or production.

To run the backend suite on production's exact interpreter:

```bash
docker compose build web && docker run --rm -v "$PWD":/usr/joyce -w /usr/joyce joyce_flask-web sh -c "pip install -q -r requirements-dev.txt && python -m pytest"
```

## Deployment topology

`docker-compose.yml` defines: `elasticsearch`, `kibana` (ops/debugging UI), `web` (Flask app served by `waitress`), `nginx` (TLS termination/reverse proxy, config in `nginx.conf`), and `certbot` (Let's Encrypt renewal). `setup/.stage.sh` shows the staging deploy sequence (build → up → import content → reload nginx). Environments are distinguished by the `HOST_ENVIRONMENT` env var, which `config.py` reads to select cookie domain and upload paths — `local` and `.localhost` domains for dev, `joyce-staging.net` for staging, `joyceproject.com` for production.
