# syntax=docker/dockerfile:1
FROM python:3.11.7-alpine
WORKDIR /Users/alexhunt/Projects/joyce_flask
ENV FLASK_APP=application.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=443
RUN apk add --no-cache gcc musl-dev linux-headers
RUN apk --update add \
    build-base \
    jpeg-dev \
    zlib-dev
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
# RUN npm run build
# RUN python -m joyce_flask.setup.joyce_import
EXPOSE 443
COPY . .
CMD ["python", "-m", "application"]