#!/bin/bash

cd users
rm -rf proto build
mkdir -p proto build/proto
cp ../proto/users.proto proto/users.proto
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
cp proto/users.proto build/proto/users.proto
tsc-watch -p tsconfig.json --onSuccess "node build/server/src/index.js"
