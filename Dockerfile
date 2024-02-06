# syntax=docker/dockerfile:1
FROM python:3.11.7-alpine
WORKDIR /usr/joyce
ENV IN_DOCKER_CONTAINER=1
ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache gcc musl-dev linux-headers
RUN apk --update add \
    build-base \
    jpeg-dev \
    zlib-dev
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
CMD ["waitress-serve", "url-scheme=https", "application:application"]