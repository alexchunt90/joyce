# Joyce
_A Reader and Editor for Hypertext_

Joyce is a web app for reading and annotating texts. It was designed to power [The Joyce Project](http://www.joyceproject.com/), a website to help introduce James Joyce's Ulysses to new readers with the full-text and detailed annotations.

Joyce uses Python and Flask for the backend, Elasticsearch for the datastore, and React and Bootstrap for the front end, bundled with Webpack. The text editor is built on DraftJS. 

## Setup

This assumes you have npm and python 3.11.

- To ensure that elasticsearch doesn't crash, run `sysctl -w vm.max_map_count=262144` and append your host system's /etc/sysctl.conf with `vm.max_map_count=262144`
- Clone the repo with `git clone https://github.com/alexchunt90/joyce.git`
- Setup a python3 venv in the repo folder and activate
- Build the docker image with `docker compose build`
- Run the docker image with `docker compose d`
- 


- For local development use `npm run watch` to rebuild JS on the fly with webpack.
- For a production server use `npm run build` to create JS. 



