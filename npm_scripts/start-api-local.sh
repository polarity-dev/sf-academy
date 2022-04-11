#!/bin/bash

cd api
rm -rf proto openapi build
mkdir -p build/proto build/openapi
cp -r ../proto .
cp -r ../openapi .
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
cp -r proto build
cp -r openapi build
tsc-watch -p tsconfig.json --onSuccess "node build/server/src/index.js"