# Code taken from itnext.io
OUT_PATH=secrets/keys/sign/grpc_credentials
# 1. Generate CA's private key and self-signed certificate
openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout $OUT_PATH/ca-key.pem -out $OUT_PATH/ca-cert.pem -subj "/C=FR/ST=Occitanie/L=Toulouse/O=Test Org/OU=Test/CN=*.test/emailAddress=test@gmail.com"

echo "CA's self-signed certificate"
openssl x509 -in $OUT_PATH/ca-cert.pem -noout -text

# 2. Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout $OUT_PATH/server-key.pem -out $OUT_PATH/server-req.pem -subj "/C=IT/ST=Emilia Romagna/L=Reggio Emilia/O=Server TLS/OU=Server/CN=*.tls/emailAddress=tls@gmail.com"

# Remember that when we develop on localhost, It’s important to add the IP:0.0.0.0 as an Subject Alternative Name (SAN) extension to the certificate.
echo "subjectAltName=DNS:*.tls,DNS:localhost,DNS:users,IP:0.0.0.0" > $OUT_PATH/server-ext.cnf
# Or you can use localhost DNS and grpc.ssl_target_name_override variable
# echo "subjectAltName=DNS:localhost" > server-ext.cnf

# 3. Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -req -in $OUT_PATH/server-req.pem -days 60 -CA $OUT_PATH/ca-cert.pem -CAkey $OUT_PATH/ca-key.pem -CAcreateserial -out $OUT_PATH/server-cert.pem -extfile $OUT_PATH/server-ext.cnf

echo "Server's signed certificate"
openssl x509 -in $OUT_PATH/server-cert.pem -noout -text

# 4. Generate client's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 -nodes -keyout $OUT_PATH/client-key.pem -out $OUT_PATH/client-req.pem -subj "/C=IT/ST=Emilia Romagna/L=Reggio Emilia/O=PC Client/OU=Computer/CN=*.client.com/emailAddress=client@gmail.com"

# Remember that when we develop on localhost, It’s important to add the IP:0.0.0.0 as an Subject Alternative Name (SAN) extension to the certificate.
echo "subjectAltName=DNS:*.client.com,IP:0.0.0.0" > $OUT_PATH/client-ext.cnf

# 5. Use CA's private key to sign client's CSR and get back the signed certificate
openssl x509 -req -in $OUT_PATH/client-req.pem -days 60 -CA $OUT_PATH/ca-cert.pem -CAkey $OUT_PATH/ca-key.pem -CAcreateserial -out $OUT_PATH/client-cert.pem -extfile $OUT_PATH/client-ext.cnf

echo "Client's signed certificate"
openssl x509 -in $OUT_PATH/client-cert.pem -noout -text