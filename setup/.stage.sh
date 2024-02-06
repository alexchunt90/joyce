npm run stage
docker compose build
docker compose up -d

#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d joyce-staging.net
#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d joyce-staging.net