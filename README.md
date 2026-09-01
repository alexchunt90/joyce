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
npm run test:py:es # pytest — integration tests against a real Elasticsearch
```

To run the backend tests on the exact interpreter production uses, against the built image:

```bash
docker compose build web && docker run --rm -v "$PWD":/usr/joyce -w /usr/joyce joyce_flask-web sh -c "pip install -q -r requirements-dev.txt && python -m pytest"
```

ES Snapshotting

- Create S3 bucket and IAM user/policy with required permissions
	- https://www.elastic.co/guide/en/elasticsearch/reference/8.17/repository-s3.html#repository-s3-permissions
- Add S3 Access and Secret keys to ES keystore using Docker terminal
- Configure repository in Kibana

## Production data for local testing

Production is backed up daily to two S3 buckets — `joyce-snapshot` (the Elasticsearch
snapshot repository, written by Kibana's Snapshot feature) and `joyceimages` (uploaded
media, written by an `aws s3 sync` cron job). `setup/prod_snapshot.sh` replicates both
onto a dev machine and loads them into the local stack, so local work runs against the
real chapters, notes and images instead of seed data.

```bash
sh setup/prod_snapshot.sh all           # pull both buckets, then restore into the local stack
sh setup/prod_snapshot.sh pull          # download only; touches nothing local
sh setup/prod_snapshot.sh list          # list the snapshots currently in the mirror
sh setup/prod_snapshot.sh restore-es    # load a snapshot into local Elasticsearch
sh setup/prod_snapshot.sh restore-media # copy media files into ./static
```

Add `--dry-run` to any of these to see what would move. `restore-es` takes
`--snapshot <name>` to pick a specific day (default is the most recent successful one)
and `--yes` to skip its confirmation prompt.

**The script cannot modify the production backups.** It makes exactly one kind of AWS
call — a read, with the bucket in the source position — and the local cluster restores
from the downloaded copy under `backups/elasticsearch`, mounted into the container
read-only at `/mnt/snapshots` and registered as a `readonly` repository. The production
buckets are never registered in a local Elasticsearch, so no restore, Kibana click, or
bug in the script has a path to them.

What it does change locally: `restore-es` **deletes and replaces** the local `chapters`,
`notes`, `info`, `tags`, `editions` and `media` indices (it prompts first). Restores
exclude global cluster state, so production's settings and security realm stay out of
the local cluster. `restore-media` is additive — it never deletes, so media uploaded
through the local editor survives — and skips `static/js`, which belongs to the local
webpack build.

`aws s3 sync` compares size and timestamp, which can skip the repository's `index.latest`
pointer: it is a fixed 8 bytes whose contents change on every snapshot. The script syncs
with `--exact-timestamps`, re-fetches `index.latest` afterwards, and reports when the
pointer disagrees with the highest `index-N` in the mirror. (Elasticsearch recovers from
a stale pointer on its own by scanning the `index-N` blobs, so a disagreement is a
staleness signal rather than a broken restore.)

ES Security

- Use `docker compose exec` to reset passwords for the elastic and kibana_system users.
- Save the resulting passwords in the .env file. 