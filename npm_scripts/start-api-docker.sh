#!/bin/sh

rm -rf build
node_modules/.bin/proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
mkdir build
cp -r proto ./build
cp -r openapi ./build
node_modules/.bin/tsc -p tsconfig.json
