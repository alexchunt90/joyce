# Joyce
_A Reader and Editor for Hypertext_

Joyce is a web app for reading and annotating texts. It was designed to power [The Joyce Project](http://www.joyceproject.com/), a website to help introduce James Joyce's Ulysses to new readers with the full-text and detailed annotations.

Joyce uses Python and Flask for the backend, Elasticsearch for the datastore, and React and Bootstrap for the front end, bundled with Webpack. The text editor is built on DraftJS. 

## Setup

This assumes you have npm and python 3.11.

- To ensure that elasticsearch doesn't crash, run `sysctl -w vm.max_map_count=262144` and append your host system's /etc/sysctl.conf with `vm.max_map_count=262144`
- Clone the repo with `git clone https://github.com/alexchunt90/joyce.git`
- Run `npm install` for JS packages.
- Create self-sign SSL certificates: `sh setup/.cert.sh`
- Setup a python3 venv in the repo folder and activate
- Build JS static assets:
	- For local development, `npm run watch`
	- For a dev server, `npm run build_dev`
	- For a production server, `npm run build`
- Build the docker image with `docker compose build`
- Run the docker image with `docker compose d`
- Create a config.py for secrets.
- Run `python -m setup.joyce_import` to create elasticsearch mappings and import legacy Joyce data. Elasticsearch and Flask must be running for this script to work.
- With import completed, comment out the 9200 ports in docker-compose.yml


ES Snapshotting

- Create S3 bucket and IAM user/policy with required permissions
	- https://www.elastic.co/guide/en/elasticsearch/reference/8.17/repository-s3.html#repository-s3-permissions
- Add S3 Access and Secret keys to ES keystore using Docker terminal
- Configure repository in Kibana