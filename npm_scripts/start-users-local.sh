#!/bin/bash

cd users
rm -rf proto build
mkdir -p build/proto
cp -r ../proto .
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
cp -r proto build
tsc-watch -p tsconfig.json --onSuccess "node build/server/src/index.js"
