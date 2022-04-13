#!/bin/sh

rm -rf build
mkdir build
node_modules/.bin/proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
cp -r proto ./build
node_modules/.bin/tsc -p tsconfig.json
