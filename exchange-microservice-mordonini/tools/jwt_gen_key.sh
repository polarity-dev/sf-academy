# Code taken from https://kb.vander.host/security/how-to-generate-rsa-public-and-private-key-pair-in-pkcs8-format/
OUT_PATH=secrets/keys/sign/jwt

# Gen. key pair
openssl genrsa -out $OUT_PATH/keypair.pem 2048

# Extract public part
openssl rsa -in $OUT_PATH/keypair.pem -pubout -out $OUT_PATH/publickey.crt

# Extract private part
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in $OUT_PATH/keypair.pem -out $OUT_PATH/pkcs8.key