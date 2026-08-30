# Joyce
_A Reader and Editor for Hypertext_

Joyce is a web app for reading and annotating texts. It was designed to power [The Joyce Project](http://www.joyceproject.com/), a website to help introduce James Joyce's Ulysses to new readers with the full-text and detailed annotations.

Joyce uses Python and Flask for the backend, Elasticsearch for the datastore, and React and Bootstrap for the front end, bundled with Webpack. The text editor is built on DraftJS. 

## Setup

This assumes you have npm and Python. **Production and CI run Python 3.11.7** (see the
Dockerfile and `.github/workflows/test.yml`). Local development on a newer Python works —
every dependency in `requirements.txt` is pinned and version-independent — but CI is the
source of truth for production parity.

- To ensure that elasticsearch doesn't crash, run `sysctl -w vm.max_map_count=262144` and append your host system's /etc/sysctl.conf with `vm.max_map_count=262144`
- Clone the repo with `git clone https://github.com/alexchunt90/joyce.git`
- Run `npm install` for JS packages.
- Create self-sign SSL certificates: `sh setup/.cert.sh`
- Set up a python3 venv in the repo folder, activate it, and install dependencies:
  `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt -r requirements-dev.txt`
- Build JS static assets:
	- For local development, `npm run watch`
	- For a dev server, `npm run stage`
	- For a production server, `npm run build`
- Build the docker image with `docker compose build`
- Run the docker image with `docker compose d`
- Create a config.py for secrets.
- Run `python -m setup.joyce_import` to create elasticsearch mappings and import legacy Joyce data. Elasticsearch and Flask must be running for this script to work.
- With import completed, comment out the 9200 ports in docker-compose.yml


## Tests

```bash
npm test          # jest — frontend unit tests
npm run test:py   # pytest — backend tests (runs .venv/bin/python)
```

`npm run test:smoke` runs the legacy live-server test in `tests/smoke/`. It talks to a real
API and mutates real data — never point it at staging or production.

To run the backend tests on the exact interpreter production uses, against the built image:

```bash
docker compose build web && docker run --rm -v "$PWD":/usr/joyce -w /usr/joyce joyce_flask-web sh -c "pip install -q -r requirements-dev.txt && python -m pytest"
```

ES Snapshotting

- Create S3 bucket and IAM user/policy with required permissions
	- https://www.elastic.co/guide/en/elasticsearch/reference/8.17/repository-s3.html#repository-s3-permissions
- Add S3 Access and Secret keys to ES keystore using Docker terminal
- Configure repository in Kibana

ES Security

- Use `docker compose exec` to reset passwords for the elastic and kibana_system users.
- Save the resulting passwords in the .env file. 