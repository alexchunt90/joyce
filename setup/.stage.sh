npm run stage
docker compose build
docker compose up -d
python -m setup.joyce_import
npm run import -- info
npm run import -- notes
npm run import -- chapters

docker exec -it nginx_proxy nginx -s reload

# Get CA certificates 
#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d joyce-staging.net
#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d joyce-staging.net

# Cron to keep them updated
# sudo apt-get install postfix
# crontab -e
# 0 12 * * * /usr/bin/docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d joyce-staging.net

# npx -p @babel/core -p @babel/node babel-node --presets @babel/preset-env /joyce/setup/draftImport.js