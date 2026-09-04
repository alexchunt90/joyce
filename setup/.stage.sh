

# Push to prod: scp -o BatchMode=yes static/js/* root@joyceproject.com:/joyce/static/js/

# Get CA certificates 
#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d joyce-staging.net
#docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d joyce-staging.net

# Cron to keep them updated
# sudo apt-get install postfix
# crontab -e
# 0 12 * * * /usr/bin/docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d joyce-staging.net

# docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d www.joyceproject.com joyceproject.com

# docker compose run --rm certbot certonly --expand --dry-run -d joyceproject.com -d m.joyceproject.com -d www.joyceproject.com
# docker compose run --rm certbot certonly --expand -d joyceproject.com -d m.joyceproject.com -d www.joyceproject.com