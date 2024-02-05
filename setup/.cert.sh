# Clear existing files
rm server.csr
rm server.key
rm server.crt
rm root.srl
rm root.key
rm root.crt
# Root key and cert
openssl genrsa -out root.key 2048
openssl req -x509 -new -nodes -key root.key -sha256 -days 365 -out root.crt -config setup/root.conf

# Server key
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config setup/root.conf


openssl x509 -req -trustout -in server.csr -CA root.crt -CAkey root.key -CAcreateserial -out server.crt -days 3650 -sha256 -extfile setup/crt.conf