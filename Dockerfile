# syntax=docker/dockerfile:1
FROM python:3.11.7-alpine
WORKDIR /usr/joyce
ENV PYTHONUNBUFFERED=1
RUN apk add --no-cache gcc musl-dev linux-headers
RUN apk --update add \
    build-base \
    jpeg-dev \
    zlib-dev
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
# waitress defaults to 4 threads. That was the whole server: HTML, every API call, and
# — until nginx started serving /static/ itself — ~1GB of images, with proxy_buffering
# off in nginx so one slow client downloading one image held a thread for the length of
# the transfer. The app is I/O bound on Elasticsearch, so threads are cheap here; 16 is
# deliberately modest because the host is a 3.8GiB VM with no swap.
CMD ["waitress-serve", "--url-scheme=https", "--threads=16", "application:application"]