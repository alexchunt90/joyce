# Joyce
_A Reader and Editor for Hypertext_

Joyce is a web app for reading and annotating texts. It was designed to power [The Joyce Project](http://www.joyceproject.com/), a website to help introduce James Joyce's Ulysses to new readers with the full-text and detailed annotations.

Joyce uses Python and Flask for the backend, Elasticsearch for the datastore, and React and Bootstrap for the front end, bundled with Webpack. The text editor is built on DraftJS. 

## Setup

This assumes you have Node, npm, pip and optionall virtualenv installed.

Install Elasticsearch:
```
brew install elasticsearch
```

Joyce requires Python 2.7:
```
virtualenv -p /usr/bin/python2.7 joyce_flask

source bin/activate
```

Install the Python backend:
```
pip install -r requirements.txt
```

Install the Javascript frontend:
```
npm install
```

Setup the Elasticsearch indexes:
```
python setup.py
```

## Run Locally

Start Elasticsearch:
```
elasticsearch
```

Start Webpack in watch mode:
```
npm run watch
```

Start Python application:
```
python application.py
```

You should now find Joyce running locally at:
```
localhost:5000
```