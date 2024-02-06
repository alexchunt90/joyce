# syntax=docker/dockerfile:1
FROM python:3.11.7-alpine
WORKDIR /Users/alexhunt/Projects/joyce_flask
ENV IN_DOCKER_CONTAINER=1
RUN apk add --no-cache gcc musl-dev linux-headers
RUN apk --update add \
    build-base \
    jpeg-dev \
    zlib-dev
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY static/ static/
#COPY setup/ setup/
COPY blueprints/ blueprints/
COPY templates/ templates/
COPY config.py config.py
COPY application.py application.py
COPY .env .env
COPY server.crt server.crt
COPY server.key server.key

EXPOSE 8080
CMD ["waitress-serve", "application:application"]